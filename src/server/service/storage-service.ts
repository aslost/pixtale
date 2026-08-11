import { count, desc, eq, inArray, sum } from 'drizzle-orm';
import { createId } from '@/server/lib/id';
import { photoTab } from '@/server/entity/photo';
import { type Storage, type StorageInto, storageTab } from '@/server/entity/storage';
import { type StorageSetTopBo, type StorageToggleStatusBo } from '@/server/entity/bo/storage';
import { type PageVo } from '@/server/entity/vo/common';
import { type StorageSelectVo, type StorageVo } from '@/server/entity/vo/storage';
import { StorageStatusEnum, StorageTypeEnum } from '@/server/enums/storage-enum';
import BizError from '@/server/error/biz-error';
import { isBlobConfigured } from '@/server/lib/blob';
import { STORAGE_LIST_CACHE_KEY } from '@/server/const/cache';
import { cache } from '@/server/infra/cache';
import { orm } from '@/server/infra/db';

// 这个模块处理存储配置的数据查询和写入业务。

const storageService = {

  // 查询全部正常存储配置，返回下拉选择需要的字段。
  async select(): Promise<StorageSelectVo[]> {
    const list = await orm
      .select({
        storageId: storageTab.storageId,
        name: storageTab.name,
        type: storageTab.type,
      })
      .from(storageTab)
      .where(eq(storageTab.status, StorageStatusEnum.NORMAL))
      .orderBy(desc(storageTab.sort));

    // Blob 仅 Vercel 返回；Vercel 上不返回本地存储；Blob 未配置也不进选择列表。
    return list.filter((item) => this.isStorageVisible(item.type, true));
  },

  // 查询全部存储配置，并统计每个存储下的照片数量和已用容量。
  async list(): Promise<PageVo<StorageVo>> {

    const storageList = await orm
      .select()
      .from(storageTab)
      .orderBy(desc(storageTab.sort));

    // Blob 仅 Vercel 返回；Vercel 上不返回本地存储。
    const visibleList = storageList.filter((item) => this.isStorageVisible(item.type, false));

    if (!visibleList.length) {
      return { list: [], total: 0 };
    }

    const storageIds = visibleList.map((storage) => storage.storageId);

    const photoStatList = await orm
      .select({
        storageId: photoTab.storageId,
        photoTotal: count(photoTab.photoId),
        usedCapacity: sum(photoTab.size)
      })
      .from(photoTab)
      .where(inArray(photoTab.storageId, storageIds))
      .groupBy(photoTab.storageId);

    const list = visibleList.map((storage) => {
      const photoStat = photoStatList.find((stat) => stat.storageId === storage.storageId);
      const unavailable = storage.type === StorageTypeEnum.BLOB && !isBlobConfigured();

      return {
        ...storage,
        unavailable,
        photoTotal: Number(photoStat?.photoTotal ?? 0),
        usedCapacity: Number(photoStat?.usedCapacity ?? 0)
      };
    });

    return { list, total: list.length };
  },

  // 判断存储是否对当前环境可见；选择列表额外要求 Blob 已配置。
  isStorageVisible(type: number, forSelect: boolean) {
    if (type === StorageTypeEnum.BLOB) {
      if (!process.env.VERCEL) {
        return false;
      }

      if (forSelect && !isBlobConfigured()) {
        return false;
      }

      return true;
    }

    if (process.env.VERCEL && type === StorageTypeEnum.LOCAL) {
      return false;
    }

    return true;
  },

  // 添加当前用户的存储配置，并阻止创建重复名称。
  async add(params: StorageInto, userId: string): Promise<void> {
    const name = params.name?.trim();

    if (!name) {
      throw new BizError('storage.nameRequired');
    }

    if (!params.type) {
      throw new BizError('storage.typeRequired');
    }

    const [existsStorage] = await orm
      .select()
      .from(storageTab)
      .where(eq(storageTab.name, name))
      .limit(1);

    if (existsStorage) {
      throw new BizError('storage.nameExists');
    }

    await orm.insert(storageTab).values({
      ...params,
      storageId: createId(),
      name,
      userId,
      sort: 0
    });

    await this.refreshStorageCache();
  },

  // 把指定存储配置置顶。
  async setTop(params: StorageSetTopBo): Promise<void> {
    if (!params.storageId) {
      throw new BizError('storage.selectRequired');
    }

    await orm.update(storageTab)
      .set({
        sort: Date.now()
      })
      .where(eq(storageTab.storageId, params.storageId));

    await this.refreshStorageCache();
  },

  // 切换指定存储配置的启用状态。
  async toggleStatus(params: StorageToggleStatusBo): Promise<void> {
    if (!params.storageId) {
      throw new BizError('storage.selectRequired');
    }

    const [storage] = await orm
      .select({
        status: storageTab.status
      })
      .from(storageTab)
      .where(eq(storageTab.storageId, params.storageId))
      .limit(1);

    if (!storage) {
      throw new BizError('storage.notFound');
    }

    await orm.update(storageTab)
      .set({
        status: storage.status === StorageStatusEnum.NORMAL
          ? StorageStatusEnum.DISABLE
          : StorageStatusEnum.NORMAL
      })
      .where(eq(storageTab.storageId, params.storageId));

    await this.refreshStorageCache();
  },

  // 修改指定存储配置。
  async set(params: Storage): Promise<void> {
    const name = params.name?.trim();

    if (!params.storageId) {
      throw new BizError('storage.selectRequired');
    }

    if (!name) {
      throw new BizError('storage.nameRequired');
    }

    if (!params.type) {
      throw new BizError('storage.typeRequired');
    }

    await orm.update(storageTab)
      .set({
        name,
        type: params.type,
        domain: params.domain?.trim() || null,
        bucket: params.bucket?.trim() || null,
        region: params.region?.trim() || null,
        endpoint: params.endpoint?.trim() || null,
        accessKey: params.accessKey?.trim() || null,
        secretKey: params.secretKey?.trim() || null,
        status: params.status ?? StorageStatusEnum.NORMAL
      })
      .where(eq(storageTab.storageId, params.storageId));

    await this.refreshStorageCache();
  },

  // 删除指定存储配置。
  async delete(storageId: string): Promise<void> {
    if (!storageId) {
      throw new BizError('storage.selectRequired');
    }

    await orm.delete(storageTab)
      .where(eq(storageTab.storageId, storageId));

    await this.refreshStorageCache();
  },

  // 查询全部存储配置，优先读缓存。
  async getStorageList(): Promise<Storage[]> {
    let storageList = await cache.get<Storage[]>(STORAGE_LIST_CACHE_KEY);

    if (!storageList) {
      storageList = await orm
        .select()
        .from(storageTab)
        .orderBy(desc(storageTab.sort));

      await cache.set(STORAGE_LIST_CACHE_KEY, storageList);
    }

    return storageList;
  },

  // 刷新存储配置缓存。
  async refreshStorageCache(): Promise<void> {
    const storageList = await orm
      .select()
      .from(storageTab)
      .orderBy(desc(storageTab.sort));

    await cache.set(STORAGE_LIST_CACHE_KEY, storageList);
  }
}

export { storageService };

import { type Storage } from '@/server/entity/storage';

// 这个模块定义存储配置接口返回对象。

interface StorageVo extends Storage {
  photoTotal: number;
  usedCapacity: number;
  // 未绑定等导致当前环境不可用（如 Blob 无 BLOB_STORE_ID）。
  unavailable?: boolean;
}

type StorageSelectVo = Pick<Storage, 'storageId' | 'name' | 'type'>;

export type { StorageSelectVo, StorageVo };

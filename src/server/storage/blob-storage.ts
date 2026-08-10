import { del, get, issueSignedToken, presignUrl, put } from '@vercel/blob';
import {
  type StorageGetOptions,
  type StorageObject,
  type StorageStrategy,
  type StorageUploadObject,
} from '@/server/storage/storage-types';
import { registerStorageStrategy } from '@/server/storage/storage-registry';
import { type Storage } from '@/server/entity/storage';
import { StorageTypeEnum } from '@/server/enums/storage-enum';
import { isBlobConfigured } from '@/server/lib/blob';
import BizError from '@/server/error/biz-error';

// 这个模块实现 Vercel Blob 存储策略。

class BlobStorageStrategy implements StorageStrategy {

  // 确认已绑定 Blob，否则抛错。
  private assertConfigured() {
    if (!isBlobConfigured()) {
      throw new BizError('blob.notConfigured');
    }
  }

  // 保存多个文件到 Vercel Blob。
  async put(files: StorageUploadObject[], _storage: Storage): Promise<void> {
    this.assertConfigured();

    for (const file of files) {
      const cacheControl = file.metadata?.find(([name]) => name === 'Cache-Control')?.[1];
      const cacheControlMaxAge = cacheControl?.match(/max-age=(\d+)/i)?.[1];

      await put(file.key, file.body, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: cacheControlMaxAge ? Number(cacheControlMaxAge) : 604800,
      });
    }
  }

  // 从 Vercel Blob 读取文件；传 as 时返回 Uint8Array，否则返回流。
  async get(key: string, _storage: Storage, options?: StorageGetOptions): Promise<StorageObject> {
    this.assertConfigured();

    const res = await get(key, { access: 'public', useCache: false });

    if (!res || res.statusCode !== 200 || !res.stream) {
      throw new BizError(
        !res
          ? `Vercel Blob: The requested blob does not exist (${key})`
          : `Vercel Blob: unexpected status ${res.statusCode}`,
      );
    }

    const type = res.blob.contentType || 'application/octet-stream';

    if (options?.as === 'uint8array') {
      const body = new Uint8Array(await new Response(res.stream).arrayBuffer());
      return {
        body,
        size: res.blob.size ?? body.length,
        type,
      };
    }

    return {
      body: res.stream,
      size: res.blob.size ?? 0,
      type,
    };
  }

  // 从 Vercel Blob 删除一个或多个文件。
  async delete(key: string | string[], _storage: Storage): Promise<void> {
    this.assertConfigured();

    const keys = Array.isArray(key) ? key : [key];

    if (!keys.length) {
      return;
    }

    await del(keys);
  }

  // 用 OIDC 签发预签名 PUT URL，供前端直传。
  async createUrl(key: string, _storage: Storage, contentType?: string): Promise<string> {
    this.assertConfigured();

    const allowedContentTypes = contentType ? [contentType, 'image/*'] : ['image/*'];
    const validUntil = Date.now() + 15 * 60 * 1000;

    // 中文文件名在 delegation token 里会编码错乱，scope 用 *，具体路径交给下方 presignUrl。
    const signed = await issueSignedToken({
      pathname: '*',
      operations: ['put'],
      validUntil,
      allowedContentTypes,
    });

    const { presignedUrl } = await presignUrl(signed, {
      access: 'public',
      operation: 'put',
      pathname: key,
      validUntil,
      allowOverwrite: true,
      addRandomSuffix: false,
      allowedContentTypes,
      cacheControlMaxAge: 604800,
    });

    return presignedUrl;
  }
}

registerStorageStrategy(StorageTypeEnum.BLOB, () => new BlobStorageStrategy());

export { BlobStorageStrategy };

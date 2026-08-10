import { StorageTypeEnum } from '@/server/enums/storage-enum';

// 这个模块提供 URL 处理相关工具方法。

// 格式化 HTTP URL，未配置时返回空字符串，未带协议时默认补 https。
function formatHttpUrl(input?: string | null) {
  const value = input?.trim();

  if (!value) {
    return '';
  }

  const httpUrl = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  return httpUrl.replace(/\/+$/, '');
}

// 把存储 key 转成可请求的文件地址；Blob 仅原图直连 CDN，缩图/高清走 /media。
function toMediaUrl(key: string, domain?: string | null, type?: number | null) {
  const encodedKey = key.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  let base = formatHttpUrl(domain);

  if (type === StorageTypeEnum.BLOB) {
    // 原图 key 前缀为 photos/，其余走代理。
    if (!key.startsWith('photos/')) {
      return `/media/${encodedKey}`;
    }

    const storeId = process.env.BLOB_STORE_ID?.trim().replace(/^store_/, '');
    if (storeId) {
      base = `https://${storeId}.public.blob.vercel-storage.com`;
    }
  }

  return base ? `${base}/${encodedKey}` : `/media/${encodedKey}`;
}

export { formatHttpUrl, toMediaUrl };

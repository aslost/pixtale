// 这个模块提供 Vercel Blob 配置探测与令牌读取。

const BLOB_STORAGE_ID = 'blob';

// 读取 Blob 读写令牌。
function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || '';
}

// 判断是否已配置 Blob 读写令牌。
function isBlobConfigured() {
  return Boolean(getBlobToken());
}

export { BLOB_STORAGE_ID, getBlobToken, isBlobConfigured };

// 这个模块提供 Vercel Blob 配置探测。

const BLOB_STORAGE_ID = 'blob';

// 判断是否已绑定 Blob（新版 OIDC 注入 BLOB_STORE_ID）。
function isBlobConfigured() {
  return Boolean(process.env.BLOB_STORE_ID?.trim());
}

export { BLOB_STORAGE_ID, isBlobConfigured };

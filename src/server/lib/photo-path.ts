// 这个模块提供照片存储路径生成方法。

// 把拍摄时间格式化成 YYYY-MM-DD 目录名。
function formatPhotoDate(takenTime: string): string {
  return takenTime.slice(0, 10);
}

// 生成原图存储路径：photos/userId/文件名。
function buildPhotoKey(userId: string, fileName: string): string {
  return `photos/${userId}/${fileName}`;
}

// 按 checksum 前四位分片，文件名用 photoId，避免相同内容 key 冲突。
function buildChecksumImageKey(prefix: 'previews' | 'thumbnails', checksum: string, photoId: string, ext: string): string {
  return `${prefix}/${checksum.slice(0, 2)}/${checksum.slice(2, 4)}/${photoId}${ext}`;
}

// 生成高清图存储路径。
function buildPreviewKey(checksum: string, photoId: string): string {
  return buildChecksumImageKey('previews', checksum, photoId, '.jpg');
}

// 生成缩略图存储路径。
function buildThumbnailKey(checksum: string, photoId: string): string {
  return buildChecksumImageKey('thumbnails', checksum, photoId, '.webp');
}

export { buildPhotoKey, buildPreviewKey, buildThumbnailKey, formatPhotoDate };

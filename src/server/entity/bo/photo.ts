// 这个模块定义照片业务入参对象。

interface PhotoTakenDateListBo {
  favorite?: number | null;
  albumId?: string | null;
  // tzOffset 为相对 UTC 的偏移分钟数，东八区为 480。
  tzOffset: number;

}

interface PhotoListBo {
  size: number;
  cursorPhotoId?: string | null;
  cursorTime?: string | null;
  startTakenTime?: string | null;
  endTakenTime?: string | null;
  favorite?: number | null;
  status?: number | null;
  albumId?: string | null;

}

interface PhotoExistsBo {
  checksum: string;
  name: string;
}

interface PhotoRecycleBo {
  photoIds: string[];
}

interface PhotoFavoriteBo {
  photoIds: string[];
  favorite: number;
}

interface PhotoRestoreBo {
  photoIds: string[];

}

interface PhotoDeleteBo {
  photoIds: string[];
}

interface PhotoCreateUrlBo {
  // 前端传入的原始文件名。
  fileName: string;
  // 目标存储配置 id。
  storageId: string;
  // 上传文件 MIME，需与 PUT 时 Content-Type 一致。
  contentType?: string;
}

export type { PhotoCreateUrlBo, PhotoDeleteBo, PhotoExistsBo, PhotoFavoriteBo, PhotoListBo, PhotoRecycleBo, PhotoRestoreBo, PhotoTakenDateListBo };


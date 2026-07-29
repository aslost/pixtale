// 这个模块定义照片接口返回对象。

import { type Photo } from '@/server/entity/photo';

type PhotoVo = Photo & {
  key: string;
  preview: string;
  thumbnail: string;
  exif: string | null;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  storageName: string | null;
  storageTypeDesc: string | null;
};

interface PhotoTakenDateVo {
  date: string;
  count: number;
}

interface PhotoAddResultVo {
  photo: PhotoVo | null;
  duplicate: boolean;
}

interface PhotoExistsVo {
  duplicate: boolean;
}

export type { PhotoVo, PhotoTakenDateVo, PhotoAddResultVo, PhotoExistsVo };

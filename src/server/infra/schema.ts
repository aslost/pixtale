import { albumTab } from '@/server/entity/album';
import { albumPhotoTab } from '@/server/entity/album-photo';
import { exifTab } from '@/server/entity/exif';
import { fileTab } from '@/server/entity/file';
import { photoTab } from '@/server/entity/photo';
import { settingTab } from '@/server/entity/setting';
import { storageTab } from '@/server/entity/storage';
import { userTab } from '@/server/entity/user';

// 这个模块统一导出 Drizzle 数据库表结构。

const schema = {
  albumPhotoTab,
  albumTab,
  exifTab,
  fileTab,
  photoTab,
  settingTab,
  storageTab,
  userTab
};

export { schema };

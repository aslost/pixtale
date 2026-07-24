import { Hono } from 'hono';
import type { Context, Next } from 'hono';
import { storage } from '@/server/storage/storage';
import { orm } from '@/server/infra/db';
import { photoTab } from '@/server/entity/photo';
import { fileTab } from '@/server/entity/file';
import { eq, and } from 'drizzle-orm';
import { contextStorage } from 'hono/context-storage';
import { security } from '../security/security';
import { getUserId } from '@/server/security/context';
import { cors } from 'hono/cors';
import { buildContentDisposition } from '@/server/lib/file';
import { FileTypeEnum } from '@/server/enums/file-enum';

// 这个模块处理照片文件读取接口，路径为 /file/{key}。

const file = new Hono();
file.use('*', cors());
file.use('*', contextStorage());
file.use('*', security);
file.onError((err, c) => c.text(err.message, 500));

// 原图返回下载文件名，缩图和高清图返回 null。
function getDisposition(type: number, name: string): string | null {
  if (type !== FileTypeEnum.ORIGINAL) {
    return null;
  }

  return buildContentDisposition(name);
}

// 根据文件 key 和当前用户 id 查询对应的文件和照片信息。
async function getPhotoFile(key: string) {

  const userId = getUserId();

  if (!userId) {
    return null;
  }

  const [row] = await orm
    .select({
      key: fileTab.key,
      type: fileTab.type,
      fileType: fileTab.fileType,
      name: photoTab.name,
      photoId: photoTab.photoId,
      storageId: photoTab.storageId
    })
    .from(fileTab)
    .innerJoin(photoTab, eq(fileTab.photoId, photoTab.photoId))
    .where(and(eq(fileTab.key, key), eq(photoTab.userId, userId)))
    .limit(1);

  return row;
}

file.get('*', async (c: Context, next: Next) => {

  if (!c.req.path.startsWith('/file/')) {
    return next();
  }

  const key = decodeURIComponent(c.req.path.slice('/file/'.length));

  const photoFile = await getPhotoFile(key);

  if (!photoFile?.key || !photoFile?.storageId) {
    return next();
  }

  const obj = await storage.get(photoFile.key, photoFile.storageId);
  const disposition = getDisposition(photoFile.type, photoFile.name);
  const headers: Record<string, string> = {
    'Content-Type': photoFile.fileType,
    'Cache-Control': 'private, max-age=604800',
    'Content-Length': String(obj.size)
  };

  if (disposition) {
    headers['Content-Disposition'] = disposition;
  }

  return c.body(obj.body, 200, headers);
})

export { file };

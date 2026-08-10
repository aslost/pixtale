import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// 头像 base64 表，user.avatar 对应本表 id。
export const avatarBase64Tab = sqliteTable('avatar_base64', {
  id: text('id').primaryKey(), // 头像 id
  base64: text('base64').notNull(), // 图片 base64（不含 data URL 前缀）
});

export type AvatarBase64 = typeof avatarBase64Tab.$inferSelect;
export type AvatarBase64Into = typeof avatarBase64Tab.$inferInsert;

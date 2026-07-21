import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// 系统设置，整份配置以 JSON 存在 value 中。

export const settingTab = sqliteTable('setting', {
  key: text('key').primaryKey(), // 配置键
  value: text('value').notNull() // 配置 JSON
});

export type Setting = {
  syncDelete: number; // 同步删除 1开启 2关闭
  clearLast: number; // 回收站照片多少天后自动清理
  photoDedup: number; // 照片去重 1开启 2关闭
};

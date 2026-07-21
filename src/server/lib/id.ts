import { v7 as uuidv7 } from 'uuid';

// 这个模块提供业务 ID 生成方法。

// 生成按时间排序的 UUID v7 业务 ID。
function createId(): string {
  return uuidv7();
}

export { createId };

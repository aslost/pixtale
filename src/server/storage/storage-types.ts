import { type Readable } from 'node:stream';
import { type Storage } from '@/server/entity/storage';

// 这个模块定义存储策略相关类型。

type ReadBody = Readable | ReadableStream;

interface StorageGetOptions {
  as?: 'uint8array';
}

interface StorageObject {
  body: ReadBody | Uint8Array;
  size: number;
  type: string;
}

interface StorageStrategy {
  put(files: StorageUploadObject[], storage: Storage): Promise<void>;
  get(key: string, storage: Storage, options?: StorageGetOptions): Promise<StorageObject>;
  delete(key: string | string[], storage: Storage): Promise<void>;
  createUrl(key: string, storage: Storage, contentType?: string): Promise<string>;
}

interface StorageUploadObject {
  key: string;
  body: Uint8Array;
  type?: string;
  metadata?: string[][];
}

export type { ReadBody, StorageGetOptions, StorageObject, StorageStrategy, StorageUploadObject };

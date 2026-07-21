import { type Readable } from 'node:stream';
import { type Storage } from '@/server/entity/storage';

// 这个模块定义存储策略相关类型。

interface StorageStrategy {
  put(files: StorageUploadBody[], storage: Storage): Promise<void>;
  get(key: string, storage: Storage): Promise<StorageBody>;
  delete(key: string | string[], storage: Storage): Promise<void>;
}

type ReadBody = Readable | ReadableStream;

interface StorageBody {
  body: ReadBody;
  size: number;
  type: string;
}

interface StorageUploadBody {
  key: string;
  body: Uint8Array;
  type?: string;
  metadata?: string[][];
}

export type { ReadBody, StorageBody, StorageStrategy, StorageUploadBody };

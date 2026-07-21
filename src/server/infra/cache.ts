// 这个模块封装进程内缓存读写。

type CacheSetOptions = {
  // ttl 缓存过期时间，单位秒。
  ttl?: number;
};

type MemoryCacheItem = {
  value: string;
  expireAt?: number;
};

// memoryCache 保存进程内缓存。
const memoryCache = new Map<string, MemoryCacheItem>();

// 把任意数据序列化成字符串。
function toCacheString(data: unknown) {
  return JSON.stringify(data);
}

// 把缓存字符串还原成原始数据。
function fromCacheString<T>(value: string): T {
  return JSON.parse(value) as T;
}

// 写入进程内缓存。
function memorySet(key: string, value: string, ttl?: number) {
  memoryCache.set(key, {
    value,
    expireAt: ttl ? Date.now() + ttl * 1000 : undefined,
  });
}

// 读取进程内缓存，过期后自动删除。
function memoryGet(key: string) {
  const item = memoryCache.get(key);

  if (!item) {
    return null;
  }

  if (item.expireAt && Date.now() >= item.expireAt) {
    memoryCache.delete(key);
    return null;
  }

  return item.value;
}

// 写入缓存。
async function set(key: string, data: unknown, options?: CacheSetOptions): Promise<void> {
  memorySet(key, toCacheString(data), options?.ttl);
}

// 读取缓存。
async function get<T>(key: string): Promise<T | null> {
  const value = memoryGet(key);

  if (value == null) {
    return null;
  }

  return fromCacheString<T>(value);
}

const cache = {
  set,
  get,
};

export { cache, type CacheSetOptions };

import { eq } from 'drizzle-orm'
import { cacheTab } from '@/server/entity/cache'
import { orm } from '@/server/infra/db'

// 这个模块封装缓存读写，当前由 dbCache 写入 SQLite cache 表。

type CacheSetOptions = {
  // ttl 缓存过期时间，单位秒。
  ttl?: number
}

// SQLite 缓存实现。
const dbCache = {

  // 写入缓存，同 key 则覆盖。
  async set(key: string, data: object, options?: CacheSetOptions): Promise<void> {
    const value = JSON.stringify(data)
    const expireTime = options?.ttl
      ? Math.floor(Date.now() / 1000) + options.ttl
      : null

    await orm.insert(cacheTab).values({
      key,
      value,
      expireTime,
    }).onConflictDoUpdate({
      target: cacheTab.key,
      set: {
        value,
        expireTime,
      },
    })
  },

  // 读取缓存，过期则删除并返回 null。
  async get<T>(key: string): Promise<T | null> {
    const [row] = await orm
      .select()
      .from(cacheTab)
      .where(eq(cacheTab.key, key))
      .limit(1)

    if (!row) {
      return null
    }

    if (row.expireTime != null && row.expireTime <= Math.floor(Date.now() / 1000)) {
      await dbCache.delete(key)
      return null
    }

    return JSON.parse(row.value) as T
  },

  // 删除缓存。
  async delete(key: string): Promise<void> {
    await orm.delete(cacheTab).where(eq(cacheTab.key, key))
  },
}

const cache = {
  // 写入缓存。
  async set(key: string, data: object, options?: CacheSetOptions): Promise<void> {
    return dbCache.set(key, data, options)
  },

  // 读取缓存。
  async get<T>(key: string): Promise<T | null> {
    return dbCache.get<T>(key)
  },

  // 删除缓存。
  async delete(key: string): Promise<void> {
    return dbCache.delete(key)
  },
}

export { cache, type CacheSetOptions }

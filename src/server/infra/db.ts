import Database from 'better-sqlite3'
import { createClient } from '@tursodatabase/serverless/compat'
import { drizzle as drizzleSqlite, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as libsqlDriverCore from 'drizzle-orm/libsql/driver-core'
import fs from 'node:fs'
import path from 'path'
import { schema } from '@/server/infra/schema'

// 这个模块负责 SQLite 数据库连接，orm 用于 Drizzle 查询；配置了 Turso 则走远程。

// construct 运行时有导出，官方类型声明未暴露。
const { construct } = libsqlDriverCore as unknown as {
  construct: (
    client: ReturnType<typeof createClient>,
    config: { schema: typeof schema },
  ) => BetterSQLite3Database<typeof schema>
}

const useTurso = Boolean(process.env.TURSO_DATABASE_URL)

const dataDir = path.join(process.cwd(), 'data')
if (!useTurso) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = useTurso ? null : new Database(path.join(dataDir, 'pixtale.sqlite'))

const turso = useTurso
  ? createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : null

export { db }
export { turso }
export const orm = (
  useTurso
    ? construct(turso!, { schema })
    : drizzleSqlite(db!, { schema })
) as BetterSQLite3Database<typeof schema>

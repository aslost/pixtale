const path = require('path')
const { createJiti } = require('jiti')

// Vercel 构建结束后执行数据库迁移；本地 build 直接跳过。

// 仅在 Vercel 且已配置远程 Turso 时执行 migrate。
async function runVercelMigrate() {
  if (!process.env.VERCEL) {
    console.log('[postbuild] skip migrate (not Vercel)')
    return
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.log('[postbuild] skip migrate (Turso not configured)')
    return
  }

  const jiti = createJiti(__filename, { tsconfigPaths: true })
  const { migrate } = await jiti.import(
    path.join(__dirname, '../src/server/infra/migrate.ts'),
  )
  const { userService } = await jiti.import(
    path.join(__dirname, '../src/server/service/user-service.ts'),
  )

  await migrate()
  await userService.init()
  console.log('[postbuild] migrate and admin init completed')
}

runVercelMigrate().catch((err) => {
  console.error('[postbuild] migrate failed', err)
  process.exit(1)
})

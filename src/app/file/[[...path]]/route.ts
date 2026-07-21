import { file } from '@/server/server'

export const runtime = 'nodejs'

const handler = (req: Request) => file.fetch(req)

export const GET = handler

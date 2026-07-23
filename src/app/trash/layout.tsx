import { cookies } from "next/headers"
import { TrashProvider } from "@/app/trash/provider"
import { getLoginInfo } from "@/lib/cookie"
import { albumService } from "@/server/service/album-service"

interface TrashLayoutProps {
  children: React.ReactNode
}

// 服务端查询回收站虚拟相册，并提供给 /trash 页面初始化入口。
export default async function TrashLayout({ children }: TrashLayoutProps) {
  const cookieStore = await cookies()
  const { userId } = await getLoginInfo(cookieStore.toString())

  if (!userId) {
    return null
  }

  const data = await albumService.trash(userId)

  return (
    <TrashProvider initialAlbum={data}>
      {children}
    </TrashProvider>
  )
}

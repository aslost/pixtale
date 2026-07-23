import { cookies } from "next/headers"
import { AlbumProvider } from "@/app/albums/provider"
import { getLoginInfo } from "@/lib/cookie"
import { albumService } from "@/server/service/album-service"

interface AlbumLayoutProps {
  children: React.ReactNode
}

// 服务端查询全部相册，并提供给 /album 页面初始化列表。
export default async function AlbumLayout({ children }: AlbumLayoutProps) {
  const cookieStore = await cookies()
  const { userId } = await getLoginInfo(cookieStore.toString())

  if (!userId) {
    return null
  }

  const data = await albumService.list(userId)

  return (
    <AlbumProvider initialAlbums={data}>
      {children}
    </AlbumProvider>
  )
}

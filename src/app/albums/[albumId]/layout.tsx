import { cookies } from "next/headers"
import { AlbumPhotoProvider } from "@/app/albums/[albumId]/provider"
import { getLoginInfo } from "@/lib/cookie"
import { PHOTO_LIST_PAGE_SIZE } from "@/server/const/global"
import { photoService } from "@/server/service/photo-service"

interface AlbumPhotoLayoutProps {
  children: React.ReactNode
  params: Promise<{
    albumId: string
  }>
}

// 服务端查询当前相册照片第一页，并提供给相册照片页初始化列表。
export default async function AlbumPhotoLayout({ children, params }: AlbumPhotoLayoutProps) {
  const { albumId } = await params
  const cookieStore = await cookies()
  const { userId } = await getLoginInfo(cookieStore.toString())

  if (!userId) {
    return null
  }

  const data = await photoService.list({
    size: PHOTO_LIST_PAGE_SIZE,
    cursorPhotoId: null,
    cursorTime: null,
    favorite: null,
    status: null,
    albumId,
  }, userId)

  return (
    <AlbumPhotoProvider initialPhotos={data.list}>
      {children}
    </AlbumPhotoProvider>
  )
}

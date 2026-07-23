import { cookies } from "next/headers"
import { PhotoProvider } from "@/app/photos/provider"
import { getLoginInfo } from "@/lib/cookie"
import { PHOTO_LIST_PAGE_SIZE } from "@/server/const/global"
import { photoService } from "@/server/service/photo-service"

interface PhotoLayoutProps {
  children: React.ReactNode
}

// 服务端查询照片第一页，并提供给 /photo 页面初始化列表。
export default async function PhotoLayout({ children }: PhotoLayoutProps) {
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
    albumId: null,
  }, userId)

  return (
    <PhotoProvider initialPhotos={data.list}>
      {children}
    </PhotoProvider>
  )
}

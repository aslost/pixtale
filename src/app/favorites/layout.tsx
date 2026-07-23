import { cookies } from "next/headers"
import { FavoriteProvider } from "@/app/favorites/provider"
import { getLoginInfo } from "@/lib/cookie"
import { PHOTO_LIST_PAGE_SIZE } from "@/server/const/global"
import { photoService } from "@/server/service/photo-service"
import { PhotoFavoriteEnum } from "@/server/enums/photo-enum"

interface FavoriteLayoutProps {
  children: React.ReactNode
}

// 服务端查询收藏照片第一页，并提供给收藏页初始化列表。
export default async function FavoriteLayout({ children }: FavoriteLayoutProps) {
  const cookieStore = await cookies()
  const { userId } = await getLoginInfo(cookieStore.toString())

  if (!userId) {
    return null
  }

  const data = await photoService.list({
    size: PHOTO_LIST_PAGE_SIZE,
    cursorPhotoId: null,
    cursorTime: null,
    favorite: PhotoFavoriteEnum.YES,
    status: null,
    albumId: null,
  }, userId)

  return (
    <FavoriteProvider initialPhotos={data.list}>
      {children}
    </FavoriteProvider>
  )
}

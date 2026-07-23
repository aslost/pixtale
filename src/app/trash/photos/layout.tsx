import { cookies } from "next/headers"
import { TrashPhotoProvider } from "@/app/trash/photos/provider"
import { getLoginInfo } from "@/lib/cookie"
import { PHOTO_LIST_PAGE_SIZE } from "@/server/const/global"
import { photoService } from "@/server/service/photo-service"
import { PhotoStatusEnum } from "@/server/enums/photo-enum"

interface TrashPhotoLayoutProps {
  children: React.ReactNode
}

// 服务端查询回收站照片第一页，并提供给回收站照片页初始化列表。
export default async function TrashPhotoLayout({ children }: TrashPhotoLayoutProps) {
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
    status: PhotoStatusEnum.DELETE,
    albumId: null,
  }, userId)

  return (
    <TrashPhotoProvider initialPhotos={data.list}>
      {children}
    </TrashPhotoProvider>
  )
}

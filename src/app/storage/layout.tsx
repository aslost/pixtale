import { cookies } from "next/headers"
import { StorageProvider } from "@/app/storage/provider"
import { getLoginInfo } from "@/lib/cookie"
import { storageService } from "@/server/service/storage-service"

interface StorageLayoutProps {
  children: React.ReactNode
}

// 服务端查询存储配置列表，并提供给 /storage 页面初始化表格。
export default async function StorageLayout({ children }: StorageLayoutProps) {
  const cookieStore = await cookies()
  const { userId } = await getLoginInfo(cookieStore.toString())

  if (!userId) {
    return null
  }

  const data = await storageService.list()

  return (
    <StorageProvider initialStorageList={data.list}>
      {children}
    </StorageProvider>
  )
}

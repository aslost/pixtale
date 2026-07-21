"use client"

import dynamic from "next/dynamic"
import * as React from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { albumList } from "@/request/album"
import { storageSelect } from "@/request/storage"
import { type UserInfoVo } from "@/server/entity/vo/user"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAlbumStore } from "@/store/album-store"
import { usePhotoStore } from "@/store/photo-store"
import { useStorageStore } from "@/store/storage-store"
import { TOKEN_COOKIE_MAX_AGE } from "@/server/const/global"

const PhotoUploadDialog = dynamic(
  () => import("@/components/photo/photo-upload-dialog").then((mod) => mod.PhotoUploadDialog),
  { ssr: false }
)

type Theme = "light" | "dark"

const THEME_COOKIE_NAME = "theme"

type ProviderProps = {
  children: React.ReactNode
  defaultTheme: Theme
  defaultSidebarOpen: boolean
  initialUserInfo: UserInfoVo | null
  title: string
}

type AppContextValue = {
  title: string
  theme: Theme
  userInfo: UserInfoVo | null
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoVo | null>>
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  refreshAlbums: () => Promise<void>
  refreshStorages: () => Promise<void>
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const AppContext = React.createContext<AppContextValue | null>(null)

// 读取应用级全局状态，供布局内的客户端组件复用。
function useApp() {
  const context = React.useContext(AppContext)

  if (!context) {
    throw new Error("useApp must be used within a Provider.")
  }

  return context
}

// 承载应用级 Provider。
function Provider({ children, defaultTheme, defaultSidebarOpen, initialUserInfo, title }: ProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  // userInfo 保存当前登录用户信息，登录后可立即更新布局展示。
  const [userInfo, setUserInfo] = React.useState<UserInfoVo | null>(initialUserInfo)
  // sidebarOpen 保存侧边栏当前展开状态，供页面切换后继续复用。
  const [sidebarOpen, setSidebarOpen] = React.useState(defaultSidebarOpen)
  const setAlbums = useAlbumStore((state) => state.setAlbums)
  const setStorages = useStorageStore((state) => state.setStorages)
  const setInfoOpen = usePhotoStore((state) => state.setInfoOpen)
  // isMobile 判断当前是否为移动端视口。
  const isMobile = useIsMobile()
  // pathname 用于在登录页跳过相册和存储等鉴权接口请求。
  const pathname = usePathname()
  const isLogin = pathname === "/login"

  useEffect(() => {
    setUserInfo(initialUserInfo)
  }, [initialUserInfo])

  // 查询正常存储配置并写入全局存储选项。
  useEffect(() => {
    if (isLogin) {
      return
    }

    void storageSelect().then((storages) => {
      setStorages(storages)
    })
  }, [isLogin, setStorages])

  // 查询相册列表并写入全局相册选项。
  useEffect(() => {
    if (isLogin) {
      return
    }

    void albumList().then((albums) => {
      setAlbums(albums)
    })
  }, [isLogin, setAlbums])

  // 移动端默认收起照片信息侧栏。
  useEffect(() => {
    if (isMobile) {
      setInfoOpen(false)
    }
  }, [isMobile, setInfoOpen])

  // 更新主题 class 和 cookie，让下次服务端渲染能恢复当前主题。
  const setTheme = React.useCallback((theme: Theme) => {
    setThemeState(theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}`
  }, [])

  // 在亮色和暗色主题之间切换。
  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [setTheme, theme])

  // 重新查询正常存储配置并写入全局存储选项，登录页不发请求。
  const refreshStorages = React.useCallback(() => {
    if (isLogin) {
      return Promise.resolve()
    }

    return storageSelect().then((storages) => {
      setStorages(storages)
    })
  }, [isLogin, setStorages])

  // 重新查询相册列表并写入全局相册选项，登录页不发请求。
  const refreshAlbums = React.useCallback(() => {
    if (isLogin) {
      return Promise.resolve()
    }

    return albumList().then((albums) => {
      setAlbums(albums)
    })
  }, [isLogin, setAlbums])

  const value = React.useMemo<AppContextValue>(
    () => ({
      title,
      theme,
      userInfo,
      setUserInfo,
      sidebarOpen,
      setSidebarOpen,
      refreshAlbums,
      refreshStorages,
      setTheme,
      toggleTheme,
    }),
    [title, theme, userInfo, sidebarOpen, refreshAlbums, refreshStorages, setTheme, toggleTheme]
  )

  return (
    <AppContext.Provider value={value}>
      <TooltipProvider>
        {children}
        <PhotoUploadDialog />
        <Toaster position="top-center" />
      </TooltipProvider>
    </AppContext.Provider>
  )
}

export { Provider, useApp }
export type { Theme }

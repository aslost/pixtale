"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { useApp } from "@/app/provider"
import { UserTypeEnum } from "@/server/enums/user-enum"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Library, MonitorCog, Image, Heart, Trash2, FolderOpen, Database, User, Settings } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "",
    email: null,
    avatar: "",
  },
  teams: [
    {
      name: "",
      logo: (
        <Library />
      ),
    },
    {
      name: "系统设置",
      logo: (
        <MonitorCog />
      ),
    },
  ],
  navMain: [
    {
      title: "照片",
      url: "/photos",
      icon: (
        <Image />
      ),
      isActive: false
    },
    {
      title: "收藏",
      url: "/favorites",
      icon: (
        <Heart />
      ),
      isActive: false
    },
    {
      title: "相册",
      url: "/albums",
      icon: (
        <FolderOpen />
      ),
      isActive: true
    },
    {
      title: "回收站",
      url: "/trash",
      icon: (
        <Trash2 />
      ),
      isActive: false
    }
  ],
  sysMain: [
    {
      title: "储存",
      url: "/storage",
      icon: (
        <Database />
      ),
      isActive: false
    },
    {
      title: "用户",
      url: "/users",
      icon: (
        <User />
      ),
      isActive: false
    },
    {
      title: "设置",
      url: "/settings",
      icon: (
        <Settings />
      ),
      isActive: false
    },
  ]
}

// 判断当前浏览器路径是否命中菜单 URL。
function isUrlMatched(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`)
}

// 根据头像 key 生成头像图片访问地址。
function getAvatarUrl(avatar: string | undefined) {
  return avatar ? `/api/user/avatar/${avatar}` : data.user.avatar
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { userInfo, title } = useApp()
  const isAdmin = userInfo?.type === UserTypeEnum.ADMIN
  const albumTeam = {
    name: title,
    logo: data.teams[0].logo,
  }
  const teams = isAdmin ? [albumTeam, data.teams[1]] : [albumTeam]
  const isSystemTeam = isAdmin && data.sysMain.some((item) => isUrlMatched(pathname, item.url))
  const activeTeam = isSystemTeam ? data.teams[1] : albumTeam
  const navItems = isSystemTeam ? data.sysMain : data.navMain
  const navUser = {
    ...data.user,
    name: userInfo?.username ?? data.user.name,
    avatar: getAvatarUrl(userInfo?.avatar),
  }

  // 切换 team 时进入对应 team 的默认页面，让刷新后也能通过 URL 判断当前 team。
  function changeTeam(team: { name: string; logo: React.ReactNode }) {
    const targetUrl = team.name === data.teams[1].name ? data.sysMain[0].url : data.navMain[0].url

    setTimeout(() => {
      router.push(targetUrl)
    }, 100)
  }

  return (
    <Sidebar collapsible="icon" className="yarl__no_scroll_padding" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={teams}
          activeTeam={activeTeam}
          onTeamChange={changeTeam}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

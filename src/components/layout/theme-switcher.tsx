"use client"

import { MoonIcon, PaletteIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useApp } from "@/app/provider"

// 渲染用户菜单里的主题切换按钮。
export function ThemeSwitcher() {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === "dark"

  return (
    <div className="flex items-center justify-between gap-3 px-2  text-sm">
      <div className="flex items-center gap-2">
        <PaletteIcon className="size-4" />
        <span>主题</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="主题"
        className="rounded-full"
        onClick={toggleTheme}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AlbumActionMenuProps {
  // 当前按钮图标是否显示阴影。
  shadow?: boolean
  onRename: () => void
  onTop: () => void
  onDelete: () => void
}

// 渲染相册卡片右上角的更多操作菜单。
export function AlbumActionMenu({ shadow = true, onRename, onTop, onDelete }: AlbumActionMenuProps) {
  const t = useTranslations("albums")
  // open 记录当前下拉菜单是否打开，用于打开时隐藏图标阴影。
  const [open, setOpen] = useState(false)
  const showShadow = shadow && !open

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 bg-transparent text-white/90 shadow-none hover:bg-transparent hover:text-white"
          aria-label="More album actions"
        >
          <MoreHorizontalIcon
            style={showShadow ? {
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5)) drop-shadow(0 0 1px rgba(0,0,0,0.3))",
            } : undefined}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-24 min-w-24">
        <DropdownMenuItem onSelect={onRename}>
          {t("actions.rename")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onTop}>
          {t("actions.pin")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>
          {t("actions.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

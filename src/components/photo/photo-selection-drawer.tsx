"use client"

import { useEffect } from "react"
import { CheckCheck, FolderMinusIcon, FolderPlusIcon, RotateCcwIcon, Trash2Icon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PhotoSelectionDrawerProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  onSelectAll: () => void
  onRestore?: () => void
  onAlbumOpen?: () => void
  onAlbumRemove?: () => void
}

// 渲染照片多选状态下的顶部操作抽屉。
export function PhotoSelectionDrawer({ open, onClose, onDelete, onSelectAll, onRestore, onAlbumOpen, onAlbumRemove }: PhotoSelectionDrawerProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    // 按下 Esc 时关闭选择抽屉，并清空照片选择。
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose])

  // 通知上层打开相册选择弹框。
  function openAlbumDialog() {
    onAlbumOpen?.()
  }

  // 通知上层把选中照片移出当前相册。
  function removeAlbumPhotos() {
    onAlbumRemove?.()
  }


  return (
    <div
      className={[
        "fixed inset-x-0 top-0 z-40 border-[var(--border)] bg-background transition-transform duration-200",
        open ? "translate-y-0 shadow-photo-bottom" : "-translate-y-full shadow-none",
      ].join(" ")}
    >
      <div className="relative flex h-11.75 items-center justify-between px-4">
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="取消选择">
          <XIcon />
        </Button>
        <div />
        <div
          className={[
            "fixed flex flex-row-reverse items-center gap-1",
            onAlbumRemove
              ? "left-[calc(100vw-9.25rem)] md:left-[calc(100vw-9.75rem)]"
              : "left-[calc(100vw-7rem)] md:left-[calc(100vw-7.5rem)]",
          ].join(" ")}
        >
          <Button size="icon" variant="ghost" onClick={onSelectAll} aria-label="全选">
            <CheckCheck />
          </Button>
          {onRestore && (
            <Button size="icon" variant="ghost" onClick={onRestore} aria-label="恢复">
              <RotateCcwIcon />
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={onDelete} aria-label="删除">
            <Trash2Icon />
          </Button>
          {onAlbumOpen && (
            <Button size="icon" variant="ghost" onClick={openAlbumDialog} aria-label="加入相册">
              <FolderPlusIcon />
            </Button>
          )}
          {onAlbumRemove && (
            <Button size="icon" variant="ghost" onClick={removeAlbumPhotos} aria-label="移出相册">
              <FolderMinusIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

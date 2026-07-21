"use client"

import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTapAction } from "@/hooks/use-tap-action"
import { formatPhotoTakenDateTime } from "@/lib/date"
import { getThumbHashUrl } from "@/lib/thumb-hash"
import { formatPhotoLocation, getPhotoColorSpace, getPhotoDeviceParams, getPhotoShootingParams, getPhotoSoftware, getPhotoTimezone } from "@/lib/viewer-field"
import { type PhotoVo } from "@/server/entity/vo/photo"

type PhotoInfoSidebarProps = {
  // 当前查看的照片。
  photo: PhotoVo | null
  // 关闭侧栏。
  onClose?: () => void
}

type PhotoViewerBlurBackgroundProps = {
  // 当前照片的 thumbHash。
  thumbHash?: string | null
}

// 格式化存储位置：存储名(类型)。
function formatStorageLocation(photo: PhotoVo) {
  if (!photo.storageName && !photo.storageTypeDesc) {
    return null
  }

  return `${photo.storageName ?? "-"} (${photo.storageTypeDesc ?? "-"})`
}

// 格式化照片名称，去掉文件后缀。
function formatPhotoName(name: string) {
  const index = name.lastIndexOf(".")

  return index > 0 ? name.slice(0, index) : name
}

// 把字节数格式化成 MB。
function formatFileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

// 格式化照片分辨率。
function formatResolution(width: number | null, height: number | null) {
  if (!width || !height) {
    return null
  }

  return `${width} × ${height}`
}

// 格式化照片像素（百万像素）。
function formatMegapixels(width: number | null, height: number | null) {
  if (!width || !height) {
    return null
  }

  return `${(width * height / 1_000_000).toFixed(2)} MP`
}

// 渲染单行照片信息，label 在左，value 在右；无值时不显示。
function PhotoInfoRow({
  label,
  value,
  wrap = false,
}: {
  label: string
  value: string | null | undefined
  wrap?: boolean
}) {
  if (!value) {
    return null
  }

  return (
    <div className={`flex min-w-0 justify-between gap-8 text-left text-sm ${wrap ? "items-start" : "items-center"}`}>
      <span className="shrink-0 text-white/60">{label}</span>
      <span
        className={`min-w-0 flex-1 text-right text-white ${wrap ? "break-words whitespace-normal" : "truncate"}`}
        title={wrap ? undefined : value}
      >
        {value}
      </span>
    </div>
  )
}

// 渲染全屏模糊背景，叠在详情与信息侧栏之下。
export function PhotoViewerBlurBackground({ thumbHash }: PhotoViewerBlurBackgroundProps) {
  const thumbHashUrl = getThumbHashUrl(thumbHash)

  if (!thumbHashUrl) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[-10] h-full w-full overflow-hidden">
      <img
        src={thumbHashUrl}
        alt=""
        className="h-full w-full scale-110 blur-sm object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}

// 渲染侧栏关闭按钮（移动端 md 以下显示）。
function SidebarCloseButton({ onClose }: { onClose: () => void }) {
  const tap = useTapAction(onClose)

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      className="absolute top-2 right-2 z-10 rounded-full bg-black/40 text-white hover:bg-black/50 md:hidden"
      {...tap}
    >
      <XIcon />
      <span className="sr-only">关闭</span>
    </Button>
  )
}

// 渲染照片信息侧栏，固定在 Lightbox 右侧。
export function PhotoInfoSidebar({ photo, onClose }: PhotoInfoSidebarProps) {
  const deviceParams = photo ? getPhotoDeviceParams(photo.exif) : []
  const shootingParams = photo ? getPhotoShootingParams(photo.exif) : []

  return (
    <aside className="fixed top-0 right-0 z-[41] flex h-full w-full flex-col overflow-y-auto bg-transparent backdrop-blur-xl text-white shadow-photo-sidebar md:w-80 md:shrink-0">
      {onClose && <SidebarCloseButton onClose={onClose} />}
      {photo && (
        <div className="text-left">
          <div className="px-4 pt-6.5 md:pt-4.5 text-sm font-medium">基本信息</div>
          <div className="space-y-1.5 px-4 py-2">
            <PhotoInfoRow label="文件名" value={formatPhotoName(photo.name)} />
            <PhotoInfoRow label="文件类型" value={photo.typeDesc.toUpperCase()} />
            <PhotoInfoRow label="文件大小" value={formatFileSize(photo.size)} />
            <PhotoInfoRow label="分辨率" value={formatResolution(photo.width, photo.height)} />
            <PhotoInfoRow label="像素" value={formatMegapixels(photo.width, photo.height)} />
            <PhotoInfoRow label="色彩空间" value={getPhotoColorSpace(photo.exif)} />
            <PhotoInfoRow label="时间日期" value={formatPhotoTakenDateTime(photo.takenTime)} />
            <PhotoInfoRow label="时区" value={getPhotoTimezone(photo.exif)} />
            <PhotoInfoRow
              label="位置"
              value={formatPhotoLocation(photo.latitude, photo.longitude, photo.altitude)}
              wrap
            />
            <PhotoInfoRow label="软件" value={getPhotoSoftware(photo.exif)} wrap />
            <PhotoInfoRow label="存储空间" value={formatStorageLocation(photo)} />
          </div>
          {shootingParams.length > 0 && (
            <>
              <div className="px-4 pt-3 text-sm font-medium">拍摄参数</div>
              <div className="space-y-1.5 px-4 py-2">
                {shootingParams.map((item) => (
                  <PhotoInfoRow key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </>
          )}
          {deviceParams.length > 0 && (
            <>
              <div className="px-4 pt-3 text-sm font-medium">设备</div>
              <div className="space-y-1.5 px-4 py-2">
                {deviceParams.map((item) => (
                  <PhotoInfoRow key={item.label} label={item.label} value={item.value} wrap={item.wrap} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  )
}

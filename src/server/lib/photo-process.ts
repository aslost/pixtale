import sharp from "sharp"
import { rgbaToThumbHash } from "thumbhash"

// 这个模块负责服务端照片压缩和 thumbHash 生成。

// 把 sharp 的 Buffer 转成 Uint8Array（零拷贝视图）。
function toUint8Array(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}

// 用 sharp 生成 preview、thumbnail、thumbHash 和宽高。
export async function processPhotoImages(input: Uint8Array) {
  // 先按 EXIF Orientation 摆正像素，避免 preview/thumbnail 方向错误。
  const oriented = toUint8Array(await sharp(input).autoOrient().toBuffer())
  const metadata = await sharp(oriented).metadata()
  const width = metadata.width ?? 0
  const height = metadata.height ?? 0

  const previewBuffer = toUint8Array(
    await sharp(oriented)
      .resize({ width: 1440, height: 1440, fit: "outside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()
  )

  const thumbnailBuffer = toUint8Array(
    await sharp(previewBuffer)
      .resize({ width: 300, height: 300, fit: "outside", withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer()
  )

  const hashImage = await sharp(thumbnailBuffer)
    .resize(100, 100, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const bytes = rgbaToThumbHash(hashImage.info.width, hashImage.info.height, hashImage.data)
  const thumbHash = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

  return {
    previewBuffer,
    thumbnailBuffer,
    width,
    height,
    thumbHash,
  }
}

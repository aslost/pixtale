import { thumbHashToDataURL } from "thumbhash"

// 这个模块提供 thumbHash 解码与背景图地址转换方法。

// 把 thumbHash hex 字符串还原成 Uint8Array。
function decodeThumbHash(thumbHash: string) {
  return Uint8Array.from(thumbHash.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [])
}

// 把 thumbHash 转成背景图地址。
function getThumbHashUrl(thumbHash?: string | null) {
  return thumbHash ? thumbHashToDataURL(decodeThumbHash(thumbHash)) : undefined
}

export { decodeThumbHash, getThumbHashUrl }

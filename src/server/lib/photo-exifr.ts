import exifr from 'exifr'

// 这个模块用 exifr 从原图读取拍摄元数据（Vercel 等无 Perl 环境）。

const exifPickKeys = [
  'DateTimeOriginal',
  'CreateDate',
  'OffsetTimeOriginal',
  'OffsetTimeDigitized',
  'OffsetTime',
  'Make',
  'Model',
  'LensMake',
  'LensModel',
  'Software',
  'ExposureTime',
  'FNumber',
  'FocalLength',
  'ISO',
  'ColorSpace',
  'ProfileDescription',
] as const

// 解析 +08:00 / -05:30 为相对 UTC 的分钟数。
function parseOffsetMinutes(offset: unknown) {
  if (typeof offset !== 'string') {
    return null
  }

  const match = offset.trim().match(/^([+-])(\d{2}):?(\d{2})$/)
  if (!match) {
    return null
  }

  const sign = match[1] === '-' ? -1 : 1
  return sign * (Number(match[2]) * 60 + Number(match[3]))
}

// 从 Date 或 Exif 日期字符串取出墙上时间各分量。
function parseExifDateParts(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds(),
    }
  }

  if (typeof value !== 'string') {
    return null
  }

  const [year, month, day, hour = 0, minute = 0, second = 0] = value.trim().split(/[-: ]/g).map(Number)
  if (!year || !month || !day) {
    return null
  }

  return { year, month, day, hour, minute, second }
}

// 把拍摄时间转成 ISO UTC；优先 Exif 偏移，其次前端本地偏移。
function getTakenTime(tags: Record<string, unknown>, clientOffsetMin: number) {
  const parts = parseExifDateParts(tags.DateTimeOriginal ?? tags.CreateDate)
  if (!parts) {
    return null
  }

  const offsetMin = parseOffsetMinutes(
    tags.OffsetTimeOriginal ?? tags.OffsetTimeDigitized ?? tags.OffsetTime,
  ) ?? clientOffsetMin
  const { year, month, day, hour, minute, second } = parts
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - offsetMin * 60_000
  return new Date(utcMs).toISOString()
}

// 把指定字段转成 JSON 字符串。
function buildExifJson(tags: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  for (const key of exifPickKeys) {
    const value = tags[key]
    if (value !== undefined && value !== null && value !== '') {
      data[key] = value instanceof Date ? value.toISOString() : value
    }
  }
  return Object.keys(data).length ? JSON.stringify(data) : null
}

// 从原图 Exif 读取拍摄时间、经纬度与 exif JSON 字符串。
// clientOffsetMin：前端本地相对 UTC 的分钟数（如东八区为 480），无 Exif 偏移时使用。
export async function readPhotoExifFromBuffer(input: Uint8Array, clientOffsetMin: number) {
  try {
    const tags = await exifr.parse(input, {
      pick: [...exifPickKeys, 'GPSAltitude', 'GPSAltitudeRef'],
      gps: true,
    }) as Record<string, unknown> | undefined

    if (!tags) {
      return { takenTime: null, latitude: null, longitude: null, altitude: null, exif: null }
    }

    const altitude = typeof tags.GPSAltitude === 'number'
      ? (tags.GPSAltitudeRef === 1 ? -tags.GPSAltitude : tags.GPSAltitude)
      : null

    return {
      takenTime: getTakenTime(tags, clientOffsetMin),
      latitude: typeof tags.latitude === 'number' ? tags.latitude : null,
      longitude: typeof tags.longitude === 'number' ? tags.longitude : null,
      altitude,
      exif: buildExifJson(tags),
    }
  } catch (error) {
    console.error('[ExifError] failed to read EXIF:', error)
    return { takenTime: null, latitude: null, longitude: null, altitude: null, exif: null }
  }
}

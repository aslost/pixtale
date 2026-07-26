// 这个模块提供时间解析与展示格式化方法。

// 把 ISO 或数据库时间字符串解析成 Date。
function parseTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

// 把 ISO UTC 字符串解析成时间戳，兼容无 Z 的旧格式。
function parseUtcTime(value: string) {
  const text = value.trim()
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(text)
  const utcValue = hasTimezone ? text : `${text.replace(" ", "T")}Z`
  const time = new Date(utcValue).getTime()

  if (Number.isNaN(time)) {
    return null
  }

  return time
}

// 格式化照片拍摄时间为本地日期，用于列表展示。
function formatPhotoTakenDate(takenTime: string | null | undefined, locale = "zh") {
  if (!takenTime) {
    return null
  }

  const date = parseTime(takenTime)
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date)
}

// 格式化照片拍摄时间为本地日期时间，用于详情展示。
function formatPhotoTakenDateTime(takenTime: string | null | undefined, locale = "zh") {
  if (!takenTime) {
    return null
  }

  const date = parseTime(takenTime)
  if (!date) {
    return takenTime
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date)
}

// 格式化回收时间为相对描述。
function formatRecycleTime(recycleTime?: string | null, locale = "zh") {
  if (!recycleTime) {
    return ""
  }

  const time = parseUtcTime(recycleTime)
  if (time === null) {
    return ""
  }

  const diff = Math.max(0, Date.now() - time)
  const hour = 60 * 60 * 1000
  const day = 24 * hour

  if (diff < hour) {
    return locale === "zh" ? "1 小时内" : "Within 1 hour"
  }

  if (diff < day) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(-Math.floor(diff / hour), "hour")
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(-Math.floor(diff / day), "day")
}

// 读取当前浏览器相对 UTC 的偏移分钟数，东八区为 480。
function getLocalTzOffsetMin() {
  return -new Date().getTimezoneOffset()
}

export { formatPhotoTakenDate, formatPhotoTakenDateTime, formatRecycleTime, getLocalTzOffsetMin, parseTime, parseUtcTime }

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
function formatPhotoTakenDate(takenTime: string | null | undefined) {
  if (!takenTime) {
    return null
  }

  const date = parseTime(takenTime)
  if (!date) {
    return null
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(date)

  return `${year}年${month}月${day}日 ${weekday}`
}

// 格式化照片拍摄时间为本地日期时间，用于详情展示。
function formatPhotoTakenDateTime(takenTime: string | null | undefined) {
  if (!takenTime) {
    return null
  }

  const date = parseTime(takenTime)
  if (!date) {
    return takenTime
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  const second = String(date.getSeconds()).padStart(2, "0")

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}

// 格式化回收时间为相对描述。
function formatRecycleTime(recycleTime?: string | null) {
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
    return "1 小时内"
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  }

  return `${Math.floor(diff / day)} 天前`
}

// 读取当前浏览器相对 UTC 的偏移分钟数，东八区为 480。
function getLocalTzOffsetMin() {
  return -new Date().getTimezoneOffset()
}

export { formatPhotoTakenDate, formatPhotoTakenDateTime, formatRecycleTime, getLocalTzOffsetMin, parseTime, parseUtcTime }

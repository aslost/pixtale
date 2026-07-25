// 这个模块提供文件名处理相关工具方法。

// 拆分文件名和扩展名，便于重名时在扩展名前追加时间戳。
function splitFileName(name: string) {
  const index = name.lastIndexOf('.');

  if (index <= 0) {
    return {
      baseName: name,
      extName: ''
    };
  }

  return {
    baseName: name.slice(0, index),
    extName: name.slice(index)
  };
}

// 格式化为文件名冲突用的时间戳：年月日_时分秒_毫秒。
function formatFileTimestamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  const millisecond = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}${month}${day}_${hour}${minute}${second}_${millisecond}`;
}

// 根据原文件名生成 Content-Disposition。
function buildContentDisposition(name: string) {
  const encodedName = encodeURIComponent(name)
    .replace(/[!'()*]/g, (char) =>
      `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    );
  return `inline; filename*=UTF-8''${encodedName}`;
}

export { buildContentDisposition, formatFileTimestamp, splitFileName };

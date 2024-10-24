/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

/**判断是否是ip地址 */
export function isValidIPAddress(ipAddress: string) {
  const IP_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
  return IP_REGEX.test(ipAddress);
}

// 判断是否是urld地址
export function isValidUrl(url: string): boolean {
  // 定义一个正则表达式来匹配 URL
  const regex = /^(?:http|ftp)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[?[A-F0-9]*:[A-F0-9:]+\]?)(?::\d+)?(?:\/?|[\/?]\S+)$/i;
  return regex.test(url);
}

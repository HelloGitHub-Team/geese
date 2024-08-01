/**
 * 防抖
 * @param func
 * @param wait
 * @returns function
 */
import { IncomingMessage } from 'http';

export function debounce(func: any, wait = 100) {
  return function (this: any, ...args: any[]) {
    if (func.timeout) {
      clearTimeout(func.timeout);
    }
    func.timeout = setTimeout(() => {
      func.apply(this, args);
      func.timeout = null;
    }, wait);
  };
}

export function numFormat(n: number | undefined, digits = 0, threshold = 1000) {
  if (n === void 0) {
    return '';
  }
  const num = +n;
  if (num < threshold) {
    return n;
  }
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e4, symbol: 'w' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}

/**
 * 是否是在浏览器端运行
 */
export const isClient = () => typeof window !== 'undefined';

// 格式化日期为 2022.12.23
export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const getClientIP = (req: IncomingMessage): string => {
  const forwardedFor = req.headers['x-forwarded-for'] as string;
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = req.headers['x-real-ip'] as string | undefined;
  if (realIP) {
    return realIP;
  }
  const remoteAddress = req.socket.remoteAddress;
  if (remoteAddress) {
    // 处理 IPv6 中的 IPv4 地址
    if (remoteAddress.includes('::ffff:')) {
      return remoteAddress.split('::ffff:')[1];
    }
    return remoteAddress;
  }
  return '';
};

/**
 * 防抖
 * @param func
 * @param wait
 * @returns function
 */
export function debounce(func: any, wait: number) {
  func.timeout = null;

  return function (this: any, ...args: any[]) {
    if (func.timeout) {
      clearTimeout(func.timeout);
    }
    func.timeout = setTimeout(() => {
      func.apply(this, args);
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

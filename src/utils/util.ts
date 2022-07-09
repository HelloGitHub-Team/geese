/**
 * 防抖
 * @param func
 * @param wait
 * @param immediate
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

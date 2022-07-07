/**
 * 防抖
 * @param func
 * @param wait
 * @param immediate
 * @returns function
 */
export function debounce(func, wait) {
  func.timeout = null;

  return function (...args) {
    if (func.timeout) {
      clearTimeout(func.timeout);
    }
    func.timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

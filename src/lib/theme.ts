enum Theme {
  /** 明亮模式 */
  light = 'light',
  /** 暗黑模式 */
  dark = 'dark',
  /** 跟随系统 */
  os = 'os',
}

export function toggleTheme() {
  if (localStorage.theme === Theme.os) {
    return localStorage.removeItem('theme');
  }
  localStorage.theme =
    localStorage.theme === Theme.dark ? Theme.light : Theme.dark;

  updateTheme();
}

export function updateTheme() {
  if (
    localStorage.theme === Theme.dark ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

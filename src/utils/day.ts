import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // import locale
declare module 'dayjs' {
  interface Dayjs {
    fromNow(withoutSuffix?: boolean): string;
  }
}

const locales: { [key: string]: string } = {
  en: 'en',
  zh: 'zh-cn',
};

/* eslint-disable */
const relativeTime = require('dayjs/plugin/relativeTime');
/* eslint-enable */
dayjs.extend(relativeTime);

export const fromNow = (datetime: string, locale = 'zh'): string => {
  dayjs.locale(locales[locale] || 'en');
  return dayjs(datetime).fromNow();
};

export const formatZH = (
  datetime: string,
  format = 'YYYY年MM月DD日 HH:mm'
): string => {
  return dayjs(datetime).format(format);
};

export const format = (datetime: string, format = 'YYYY-MM-DD'): string => {
  return dayjs(datetime).format(format);
};

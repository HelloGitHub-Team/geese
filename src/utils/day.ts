import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // import locale
declare module 'dayjs' {
  interface Dayjs {
    fromNow(withoutSuffix?: boolean): string;
  }
}

/* eslint-disable */
const relativeTime = require('dayjs/plugin/relativeTime');
/* eslint-enable */
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const fromNow = (datetime: string): string => {
  return dayjs(datetime).fromNow();
};

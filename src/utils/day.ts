import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/zh-cn';

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
dayjs.extend(utc);
dayjs.extend(timezone);

// 服务器时区（北京时间）
const SERVER_TIMEZONE = 'Asia/Shanghai';

/**
 * 将服务器时间（北京时间）转换为用户本地时间
 * @param datetime 服务器返回的时间字符串
 * @returns dayjs 对象（已转换为用户本地时区）
 */
const parseServerTime = (datetime: string) => {
  // 将服务器时间解析为北京时间，然后转换为用户本地时区
  return dayjs.tz(datetime, SERVER_TIMEZONE).local();
};

export const fromNow = (datetime: string, locale = 'zh'): string => {
  dayjs.locale(locales[locale] || 'en');
  return parseServerTime(datetime).fromNow();
};

export const formatZH = (
  datetime: string,
  formatStr = 'YYYY 年 MM 月 DD 日'
): string => {
  return parseServerTime(datetime).format(formatStr);
};

export const format = (datetime: string, formatStr = 'YYYY-MM-DD'): string => {
  return parseServerTime(datetime).format(formatStr);
};

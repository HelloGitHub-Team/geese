//next-i18next.config.js

module.exports = {
  debug: true,
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
  },

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  localePath: require('path').resolve('./public/locales'), // 指定翻译文件的路径
};

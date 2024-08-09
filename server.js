/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');

const app = next({ dev: false });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const DEFAULT_LOCALE = 'zh';
const FALLBACK_LOCALE = 'en';
const SUPPORTED_LOCALES = ['zh', 'en'];

async function startServer() {
  try {
    await app.prepare();
    const server = express();
    server.use(cookieParser());

    // 中间件处理语言选择和路由
    server.use((req, res, next) => {
      if (req.url.startsWith('/_next') || req.url.startsWith('/static')) {
        next();
      } else {
        let locale = req.cookies.locale;

        // 解析 URL 中的语言设置
        const urlParts = req.path.split('/');
        const urlLocale = SUPPORTED_LOCALES.includes(urlParts[1])
          ? urlParts[1]
          : null;

        if (!locale) {
          // 如果没有 cookie，使用 URL 中的语言或浏览器偏好
          const browserLocale = req.acceptsLanguages(SUPPORTED_LOCALES);
          locale = urlLocale || browserLocale || FALLBACK_LOCALE;

          // 如果浏览器语言不是中文，默认使用英语
          if (browserLocale && browserLocale !== 'zh') {
            locale = FALLBACK_LOCALE;
          }
        }

        // 确保 locale 是支持的语言之一
        locale = SUPPORTED_LOCALES.includes(locale) ? locale : FALLBACK_LOCALE;
        if (urlLocale) {
          // URL 中有语言前缀
          if (urlLocale !== locale) {
            // URL 语言与 cookie 不匹配，更新 locale
            locale = urlLocale;
          }
          if (locale === DEFAULT_LOCALE) {
            // 默认语言不应该在 URL 中显示，重定向到无前缀的 URL
            const newUrl = req.url.replace(`/${DEFAULT_LOCALE}`, '') || '/';
            return res.redirect(307, newUrl);
          }
        } else if (locale !== DEFAULT_LOCALE) {
          // URL 中没有语言前缀，且不是默认语言，添加前缀并重定向
          let newUrl = `/${locale}${req.url}`;
          if (newUrl.endsWith('/')) {
            // 如果以 '/' 结尾，去掉末尾的 '/'
            newUrl = newUrl.slice(0, -1);
          }
          return res.redirect(307, newUrl);
        }

        // 设置或更新 cookie
        res.cookie('locale', locale, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        req.locale = locale;

        // 处理尾部斜杠并重定向
        if (req.url.length > 1 && req.url.endsWith('/')) {
          const newUrl =
            req.url.slice(0, -1) +
            (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
          return res.redirect(301, newUrl);
        }

        next();
      }
    });

    // 处理所有其他请求
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

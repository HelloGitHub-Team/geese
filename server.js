/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const pino = require('pino-http')();

const app = next({ dev: false });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const DEFAULT_LOCALE = 'zh';
const FALLBACK_LOCALE = 'en';
const SUPPORTED_LOCALES = ['zh', 'en'];

const isStaticRoute = (url) => url.startsWith('/_next/data/');

const getLocaleFromUrl = (path) => {
  const urlParts = path.split('/');
  return SUPPORTED_LOCALES.includes(urlParts[1]) ? urlParts[1] : null;
};

const determineLocale = (req, urlLocale) => {
  let locale = req.cookies.locale;
  if (!locale) {
    const browserLocale = req.acceptsLanguages(SUPPORTED_LOCALES);
    locale = urlLocale || browserLocale || FALLBACK_LOCALE;
    if (browserLocale && browserLocale !== 'zh') {
      locale = FALLBACK_LOCALE;
    }
  }
  return SUPPORTED_LOCALES.includes(locale) ? locale : FALLBACK_LOCALE;
};

const handleRedirect = (req, res, locale, urlLocale) => {
  if (urlLocale) {
    if (urlLocale !== locale) {
      locale = urlLocale;
    }
    if (locale === DEFAULT_LOCALE) {
      const newUrl = req.url.replace(`/${DEFAULT_LOCALE}`, '') || '/';
      res.redirect(307, newUrl);
      return true;
    }
  } else if (locale !== DEFAULT_LOCALE) {
    let newUrl = `/${locale}${req.url}`;
    if (newUrl.endsWith('/') && newUrl.length > 1) {
      newUrl = newUrl.slice(0, -1);
    }
    res.redirect(307, newUrl);
    return true;
  }
  return false;
};

async function startServer() {
  try {
    await app.prepare();
    const server = express();
    server.use(cookieParser());
    server.use(pino);

    server.use((req, res, next) => {
      if (isStaticRoute(req.url)) {
        return next();
      }

      const urlLocale = getLocaleFromUrl(req.path);
      let locale = determineLocale(req, urlLocale);

      if (handleRedirect(req, res, locale, urlLocale)) {
        return; // 如果发生重定向，立即返回
      }

      req.locale = locale;
      next();
    });

    server.all('*', (req, res) => handle(req, res));

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

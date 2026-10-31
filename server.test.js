const mockMiddlewares = [];
const mockServer = {
  use: jest.fn((middleware) => mockMiddlewares.push(middleware)),
  listen: jest.fn(),
};
const mockHandler = jest.fn();

jest.mock('express', () => jest.fn(() => mockServer));
jest.mock('cookie-parser', () => () => 'cookies');
jest.mock('pino-http', () => () => 'logger');
jest.mock('next', () => () => ({
  prepare: () => Promise.resolve(),
  getRequestHandler: () => mockHandler,
}));

beforeAll(async () => {
  require('./server');
  await Promise.resolve();
});

it('registers the Next request handler as Express 5 middleware', () => {
  expect(mockServer.listen).toHaveBeenCalled();
  const req = {};
  const res = {};
  mockMiddlewares.at(-1)(req, res);
  expect(mockHandler).toHaveBeenCalledWith(req, res);
});

it.each([
  '/_next/static/chunks/app.js',
  '/_next/data/build/en/article.json',
  '/images/loading.svg',
  '/font/iconfont.woff2',
  '/favicon/favicon.ico',
  '/locales/en/common.json',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-0.xml',
  '/server-sitemap-index.xml',
])('does not redirect static or sitemap requests: %s', (path) => {
  const req = {
    url: path,
    path,
    cookies: { locale: 'en' },
    acceptsLanguages: () => 'en',
  };
  const res = { redirect: jest.fn() };
  const next = jest.fn();
  mockMiddlewares[2](req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(res.redirect).not.toHaveBeenCalled();
});

it.each([
  ['/article?sort_by=hot', 'en', '/en/article?sort_by=hot'],
  ['/zh/article?sort_by=hot', 'zh', '/article?sort_by=hot'],
  ['/repository/owner/project.js', 'en', '/en/repository/owner/project.js'],
  ['/en/article', 'zh', null],
  ['/article', 'zh', null],
])('preserves locale routing for %s with cookie %s', (url, locale, target) => {
  const req = {
    url,
    path: url.split('?')[0],
    cookies: { locale },
    acceptsLanguages: () => locale,
  };
  const res = { redirect: jest.fn() };
  const next = jest.fn();
  mockMiddlewares[2](req, res, next);
  if (target) {
    expect(res.redirect).toHaveBeenCalledWith(307, target);
    expect(next).not.toHaveBeenCalled();
  } else {
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  }
});

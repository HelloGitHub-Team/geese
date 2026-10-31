import type * as ImageRouting from './image';

const original = 'https://img.hellogithub.com';
const overseas = 'https://img-global.cheatsheet.store';
const initialBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const initialUpyunUrl = process.env.NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL;
const upyun = 'https://img-upyun.cheatsheet.store';

const loadRouting = (
  baseUrl?: string,
  upyunUrl?: string
): typeof ImageRouting => {
  if (upyunUrl === undefined)
    delete process.env.NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL;
  else process.env.NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL = upyunUrl;
  if (baseUrl === undefined) delete process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  else process.env.NEXT_PUBLIC_IMAGE_BASE_URL = baseUrl;
  let routing: typeof ImageRouting | undefined;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    routing = require('./image');
  });
  return routing as unknown as typeof ImageRouting;
};

afterEach(() => {
  if (initialBaseUrl === undefined)
    delete process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  else process.env.NEXT_PUBLIC_IMAGE_BASE_URL = initialBaseUrl;
  if (initialUpyunUrl === undefined)
    delete process.env.NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL;
  else process.env.NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL = initialUpyunUrl;
});

it.each([undefined, '', ' ', original, `${original}/`])(
  'keeps domestic URLs byte for byte with config %s',
  (config) => {
    const { getImageUrl, getImageSrcSet, getHtmlImageUrls } =
      loadRouting(config);
    const url = `${original}/a%2Fb//c.png!small?x=1&y=%2f#part`;
    expect(getImageUrl(url)).toBe(url);
    expect(getImageSrcSet(`${url} 1x, ${url} 2x`)).toBe(`${url} 1x, ${url} 2x`);
    const html = `<IMG SRC='${url}' srcset="${url} 2x">`;
    expect(getHtmlImageUrls(html)).toBe(html);
  }
);

it.each([
  '/article/a%2fb.png!small#top',
  '/github_avatar/name.jpeg!small',
  '/article/cover.png!headimage',
  '/article/demo.gif!gif',
  '/article/a.png#section?text',
  '#part',
  '',
])('preserves the original suffix %s without URL serialization', (suffix) => {
  const { getImageUrl } = loadRouting(overseas);
  expect(getImageUrl(original + suffix)).toBe(overseas + suffix);
});

it.each([
  '/article/a.png?width=300',
  '/article/a.png!small?token=signature',
  '/article/a.png?',
  '/article/a.png!unknown',
  '/article/a.png!/fw/300',
  '?image=a%20b#part',
])(
  'keeps dynamic processing and unsupported variants on Upyun: %s',
  (suffix) => {
    expect(loadRouting(overseas).getImageUrl(original + suffix)).toBe(
      original + suffix
    );
  }
);

it.each([
  'https://github.com/avatar.png',
  'https://thirdwx.qlogo.cn/a',
  'https://img.hellogithub.com.evil.test/a',
  'https://img.hellogithub.com@evil.test/a',
  'https://user@img.hellogithub.com/a',
  'https://evil.test/https://img.hellogithub.com/a',
  'https://evil.test/?src=https://img.hellogithub.com/a',
  'https://img.hellogithub.com:444/a',
  'http://img.hellogithub.com/a',
  '//img.hellogithub.com/a',
  '/local.png',
  'relative.png',
  'data:image/png;base64,abc',
  'blob:https://img.hellogithub.com/id',
  'https://img.hellogithub.com\\@evil.test/a',
  'https://img.hellogithub.com/a\nb',
  ' https://img.hellogithub.com/a',
  '',
  null,
  undefined,
])('leaves non-owned or unsupported input unchanged: %s', (input) => {
  expect(loadRouting(overseas).getImageUrl(input)).toBe(input);
});

it('accepts origin case and the default HTTPS port', () => {
  expect(
    loadRouting(overseas).getImageUrl('HTTPS://IMG.HELLOGITHUB.COM:443/a.png')
  ).toBe(`${overseas}/a.png`);
});

it.each([
  '/images',
  'ftp://cdn.example.com',
  'javascript:alert(1)',
  'https://user@cdn.example.com',
  'https://cdn.example.com?key=1',
  'https://cdn.example.com/#hash',
  'https://cdn.example.com/with space',
  'https://cdn.example.com\\evil',
])('falls back to domestic for invalid base %s', (config) => {
  expect(loadRouting(config).getImageUrl(`${original}/a`)).toBe(
    `${original}/a`
  );
});

it('supports a custom base path, strips trailing slashes and is idempotent', () => {
  const base = 'https://media.example.com/assets/hg';
  const { getImageUrl } = loadRouting(` ${base}/// `);
  const result = getImageUrl(`${original}/article/a.png!small#part`);
  expect(result).toBe(`${base}/article/a.png!small#part`);
  expect(getImageUrl(result)).toBe(result);
});

it('treats dollar signs in the base path literally', () => {
  expect(
    loadRouting('https://cdn.example.com/$&').getImageUrl(`${original}/a`)
  ).toBe('https://cdn.example.com/$&/a');
});

it('captures config once for consistent rendering', () => {
  const { getImageUrl } = loadRouting(overseas);
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL = 'https://other.example.com';
  expect(getImageUrl(`${original}/a`)).toBe(`${overseas}/a`);
});

it('rewrites srcset candidates while preserving descriptors and URL commas', () => {
  const { getImageSrcSet } = loadRouting(overseas);
  const source = `  ${original}/a,b.png!small?q=a,b 320w,\nhttps://third.test/a.png 640w, data:image/svg+xml,%3Csvg,%3E 2x, ${original}/large.png 3x`;
  expect(getImageSrcSet(source)).toBe(
    `  ${original}/a,b.png!small?q=a,b 320w,\nhttps://third.test/a.png 640w, data:image/svg+xml,%3Csvg,%3E 2x, ${overseas}/large.png 3x`
  );
  expect(getImageSrcSet(`${original}/a, ${original}/b, `)).toBe(
    `${overseas}/a, ${overseas}/b, `
  );
  expect(getImageSrcSet(undefined)).toBeUndefined();
});

it('rewrites only image attributes in HTML, including picture sources', () => {
  const { getHtmlImageUrls } = loadRouting(overseas);
  const html = `<a href="${original}/link">${original}/text</a><picture><source SRCSET='${original}/wide.png 2x, https://third.test/a 1x'><IMG alt="a > b" data-src="${original}/lazy" src=${original}/a.png!small?x=1&amp;y=2#p /></picture>`;
  expect(getHtmlImageUrls(html)).toBe(
    `<a href="${original}/link">${original}/text</a><picture><source SRCSET='${overseas}/wide.png 2x, https://third.test/a 1x'><IMG alt="a > b" data-src="${original}/lazy" src=${original}/a.png!small?x=1&amp;y=2#p /></picture>`
  );
});

it.each([
  '/article/a.png',
  '/article/a%2fb.png!small#part',
  '/article/a.png!headimage',
  '/article/demo.gif!gif',
  '/article/a.png?width=300',
  '/article/a.png!small?token=signature',
  '/article/a.png?',
  '/article/a.png!unknown',
  '/article/a.png!/fw/300',
])(
  'routes mainland reads and processing through configured Upyun: %s',
  (path) => {
    const routing = loadRouting('', upyun);
    expect(routing.getImageUrl(original + path)).toBe(upyun + path);
    expect(routing.getImageUrl(upyun + path)).toBe(upyun + path);
    expect(routing.getUpyunImageUrl(original + path)).toBe(upyun + path);
  }
);

it('routes both legacy and new backend origins to R2 with a configured fallback', () => {
  const routing = loadRouting(overseas, upyun);
  for (const origin of [original, upyun]) {
    expect(routing.getImageUrl(origin + '/a.png!small')).toBe(
      overseas + '/a.png!small'
    );
    expect(routing.getImageUrl(origin + '/a.png?width=300')).toBe(
      upyun + '/a.png?width=300'
    );
    expect(routing.getImageUrl(origin + '/a.png!/fw/300')).toBe(
      upyun + '/a.png!/fw/300'
    );
    expect(routing.getUpyunImageUrl(origin + '/a.png!small')).toBe(
      upyun + '/a.png!small'
    );
  }
  expect(routing.getImageUrl(overseas + '/a.png')).toBe(overseas + '/a.png');
  expect(routing.getImageUrl('/local.png')).toBe('/local.png');
  expect(
    routing.getImageUrl('https://img-upyun.cheatsheet.store.evil.test/a')
  ).toBe('https://img-upyun.cheatsheet.store.evil.test/a');
  expect(routing.getUpyunImageUrl('https://third.test/a')).toBe(
    'https://third.test/a'
  );
  expect(
    routing.getImageSrcSet(
      `${original}/a.png 1x, ${upyun}/b.png 2x`,
      routing.getUpyunImageUrl
    )
  ).toBe(`${upyun}/a.png 1x, ${upyun}/b.png 2x`);
});

it('rejects an invalid Upyun fallback without affecting R2 delivery', () => {
  const routing = loadRouting(overseas, 'https://user@bad.test');
  expect(routing.getImageUrl(original + '/a.png')).toBe(overseas + '/a.png');
  expect(routing.getUpyunImageUrl(original + '/a.png')).toBe(
    original + '/a.png'
  );
});

it('does not rewrite comments, scripts, escaped HTML or attributes on other tags', () => {
  const { getHtmlImageUrls } = loadRouting(overseas);
  const html = `<!-- <img src="${original}/comment"> --><script>const example = '<img src="${original}/script">';</script><textarea><img src="${original}/example"></textarea><div data-example='<img src="${original}/nested">'></div>&lt;img src="${original}/escaped"&gt;`;
  expect(getHtmlImageUrls(html)).toBe(html);
});

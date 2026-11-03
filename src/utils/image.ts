const ORIGINAL_IMAGE_ORIGIN = 'https://img.hellogithub.com';
const GLOBAL_IMAGE_ORIGIN = 'https://img-global.cheatsheet.store';

const getImageBaseUrl = (value: string | undefined, fallback: string) => {
  const configured = value?.trim();
  if (!configured) return fallback;

  try {
    const url = new URL(configured);
    if (
      !/^https?:\/\//i.test(configured) ||
      /[\s\\?#]/.test(configured) ||
      url.username ||
      /^https?:\/\/[^/]*@/i.test(configured)
    ) {
      return fallback;
    }
    return configured.replace(/\/+$/, '');
  } catch {
    return fallback;
  }
};

// Keep direct references: Next.js inlines NEXT_PUBLIC_* at build time.
const imageBaseUrl = getImageBaseUrl(
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
  ORIGINAL_IMAGE_ORIGIN
);
const ownedImageOriginPatterns = [
  ORIGINAL_IMAGE_ORIGIN,
  GLOBAL_IMAGE_ORIGIN,
].map(
  (origin) =>
    new RegExp(
      '^' +
        origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '(?::443)?(?=[/?#]|$)',
      'i'
    )
);

const ownedImagePathPattern =
  /^\/(?:article|i|repository|suggestions|ad|advert|avatar|github_avatar)(?:\/|$)/;

const getOwnedImagePath = (src: string): string | undefined => {
  // Backslashes/control characters have special URL-parser semantics.
  if (/[\\\u0000- \u007f]/.test(src)) return undefined;
  if (ownedImagePathPattern.test(src)) return src;
  const pattern = ownedImageOriginPatterns.find((origin) => origin.test(src));
  return pattern ? src.replace(pattern, '') : undefined;
};

/** Route owned images to the configured endpoint, preserving the raw suffix. */
export const getImageUrl = <T extends string | null | undefined>(src: T): T => {
  if (!src) return src;
  const path = getOwnedImagePath(src);
  return path === undefined ? src : ((imageBaseUrl + path) as T);
};

/** Follow srcset URL/descriptor boundaries without splitting commas in URLs. */
export const getImageSrcSet = (srcSet?: string): string | undefined => {
  if (!srcSet) return srcSet;
  let position = 0;
  let result = '';
  while (position < srcSet.length) {
    const start = position;
    while (
      /[\t\n\f\r ,]/.test(srcSet[position] || '') &&
      position < srcSet.length
    ) {
      position++;
    }
    result += srcSet.slice(start, position);
    const urlStart = position;
    while (position < srcSet.length && !/[\t\n\f\r ]/.test(srcSet[position])) {
      position++;
    }
    const token = srcSet.slice(urlStart, position);
    const url = token.replace(/,+$/, '');
    result += getImageUrl(url) + token.slice(url.length);
    if (token.endsWith(',')) continue;

    const descriptorStart = position;
    let parentheses = 0;
    while (position < srcSet.length) {
      const character = srcSet[position++];
      if (character === '(') parentheses++;
      if (character === ')') parentheses--;
      if (character === ',' && parentheses === 0) break;
    }
    result += srcSet.slice(descriptorStart, position);
  }
  return result;
};

// Skip comments and raw text elements. Attribute values may contain '>' or ','.
const htmlTagPattern =
  /<!--[\s\S]*?(?:-->|$)|<(script|style|textarea|title)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)|<([a-z][\w:-]*)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
const htmlAttributePattern =
  /([^\s=/'"<>]+)(\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;

/** Transform actual image tags only, leaving links, code and text untouched. */
export const mapHtmlImages = (
  html: string,
  transform: (tag: string, tagName: string, offset: number) => string
): string =>
  html.replace(htmlTagPattern, (tag, _rawTextTag, tagName, offset) =>
    /^(img|source)$/i.test(tagName)
      ? transform(tag, tagName.toLowerCase(), offset)
      : tag
  );

/** For the existing HTML rendering boundary (no browser-only DOMParser). */
export const getHtmlImageUrls = (html: string): string =>
  mapHtmlImages(html, (tag) =>
    tag.replace(
      htmlAttributePattern,
      (attribute, name, equals, doubleQuoted, singleQuoted, unquoted) => {
        const value = doubleQuoted ?? singleQuoted ?? unquoted;
        const routed =
          name.toLowerCase() === 'src'
            ? getImageUrl(value)
            : name.toLowerCase() === 'srcset'
              ? getImageSrcSet(value)
              : value;
        if (routed === value) return attribute;
        const quote =
          doubleQuoted !== undefined
            ? '"'
            : singleQuoted !== undefined
              ? "'"
              : '';
        return `${name}${equals}${quote}${routed}${quote}`;
      }
    )
  );

const decodeImageAttribute = (value: string): string =>
  value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, code) => {
    if (code[0] !== '#') {
      const named: Record<string, string> = {
        amp: '&',
        quot: '"',
        apos: "'",
        lt: '<',
        gt: '>',
      };
      return named[code.toLowerCase()];
    }
    const point =
      code[1].toLowerCase() === 'x'
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);
    return point > 0 &&
      point <= 0x10ffff &&
      !(point >= 0xd800 && point <= 0xdfff)
      ? String.fromCodePoint(point)
      : entity;
  });

/** Read only safe image attributes for Markdown's otherwise escaped HTML. */
export const getHtmlImageAttributes = (tag: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  tag.replace(
    htmlAttributePattern,
    (attribute, name, _equals, doubleQuoted, singleQuoted, unquoted) => {
      const key = name.toLowerCase();
      if (
        [
          'src',
          'srcset',
          'alt',
          'title',
          'width',
          'height',
          'loading',
        ].includes(key)
      ) {
        attributes[key === 'srcset' ? 'srcSet' : key] = decodeImageAttribute(
          doubleQuoted ?? singleQuoted ?? unquoted
        );
      }
      return attribute;
    }
  );
  return attributes;
};

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';

import { MDRender } from '@/components/mdRender/MDRender';
import Seo from '@/components/Seo';

import { DEFAULT_AVATAR } from '@/utils/constants';

import HostedImage from './HostedImage';
import ImageWithPreview from './ImageWithPreview';

jest.mock('@/hooks/useLoginContext', () => ({
  useLoginContext: () => ({ theme: 'light' }),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/repository/example' }),
}));
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const original = 'https://img.hellogithub.com';
const source = `${original}/article/a%2fb.png!small#part`;
const upyun =
  process.env.NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL?.replace(/\/+$/, '') || original;
const base =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, '') || upyun;
const expected = (url: string) =>
  url.replace(original, url.split('#', 1)[0].includes('?') ? upyun : base);
const fallback = (url: string) => url.replace(original, upyun);

it('renders routed src/srcset during SSR and in the browser, forwarding native props and ref', () => {
  const ref = createRef<HTMLImageElement>();
  const onError = jest.fn();
  const props = {
    src: source,
    srcSet: `${source} 1x, https://third.test/large.png 2x`,
    alt: 'example',
    width: 72,
    loading: 'lazy' as const,
    onError,
  };
  const html = renderToString(<HostedImage {...props} />);
  const serverContainer = document.createElement('div');
  serverContainer.innerHTML = html;
  const serverImage = serverContainer.querySelector('img');
  render(<HostedImage {...props} ref={ref} />);
  const image = screen.getByAltText('example');
  expect(image).toHaveAttribute('src', expected(source));
  expect(image).toHaveAttribute(
    'srcset',
    `${expected(source)} 1x, https://third.test/large.png 2x`
  );
  expect(image.isEqualNode(serverImage)).toBe(true);
  expect(ref.current).toBe(image);
  expect(image).toHaveAttribute('width', '72');
  expect(image).toHaveAttribute('loading', 'lazy');
  fireEvent.error(image);
  expect(onError).toHaveBeenCalledTimes(1);
});

it('preserves the local default avatar, third-party and other local images', () => {
  const { rerender } = render(
    <HostedImage src={DEFAULT_AVATAR} alt='avatar' />
  );
  expect(screen.getByAltText('avatar')).toHaveAttribute('src', DEFAULT_AVATAR);
  for (const url of [
    'https://thirdwx.qlogo.cn/avatar.png',
    '/images/arena/arena.svg',
  ]) {
    rerender(<HostedImage src={url} alt='avatar' />);
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', url);
  }
});

it('falls back to configured Upyun src and srcset once if a direct R2 read fails', () => {
  const onError = jest.fn();
  const srcSet = `${source} 1x, ${original}/article/large.png 2x`;
  const { rerender } = render(
    <HostedImage src={source} srcSet={srcSet} alt='pending' onError={onError} />
  );
  const image = screen.getByAltText('pending');
  fireEvent.error(image);
  expect(image).toHaveAttribute('src', fallback(source));
  expect(image).toHaveAttribute(
    'srcset',
    `${fallback(source)} 1x, ${fallback(`${original}/article/large.png`)} 2x`
  );
  const attributes = image.outerHTML;
  fireEvent.error(image);
  expect(image.outerHTML).toBe(attributes);
  expect(onError).toHaveBeenCalledTimes(2);
  const next = `${original}/article/new.png`;
  rerender(<HostedImage src={next} alt='pending' />);
  expect(image).toHaveAttribute('src', expected(next));
  fireEvent.error(image);
  expect(image).toHaveAttribute('src', fallback(next));
});

it('routes both thumbnail and full-size preview, then responds to a changed source', () => {
  const { rerender } = render(<ImageWithPreview src={source} alt='preview' />);
  expect(screen.getByAltText('preview')).toHaveAttribute(
    'src',
    expected(source)
  );
  fireEvent.click(screen.getByAltText('preview'));
  expect(screen.getAllByAltText('preview')).toHaveLength(2);
  for (const image of screen.getAllByAltText('preview')) {
    expect(image).toHaveAttribute('src', expected(source));
  }
  const next = `${original}/article/next.png?x=2#p`;
  rerender(<ImageWithPreview src={next} alt='preview' />);
  for (const image of screen.getAllByAltText('preview')) {
    expect(image).toHaveAttribute('src', expected(next));
  }
});

it('preserves GIF cover/play behavior and the full-size animated preview', () => {
  jest.useFakeTimers();
  const gif = `${original}/article/demo.gif`;
  const { container } = render(<ImageWithPreview src={gif} alt='animation' />);
  expect(screen.getByAltText('animation')).toHaveAttribute(
    'src',
    expected(`${gif}!gif`)
  );
  fireEvent.click(container.querySelector('.absolute') as HTMLElement);
  act(() => jest.runAllTimers());
  fireEvent.click(screen.getByAltText('animation'));
  for (const image of screen.getAllByAltText('animation')) {
    expect(image).toHaveAttribute('src', expected(gif));
  }
  jest.useRealTimers();
});

it('routes Markdown and embedded HTML images without changing links, text, code or external images', () => {
  const markdown = `![markdown](${source})\n\n![external](https://third.test/a.png)\n\n[link](${source})\n\n${original}/plain.png\n\n\`![code](${source})\`\n\n<img src="${original}/html.png!small?x=1&amp;y=2#p" srcset="${original}/small.png 320w, https://third.test/large.png 640w" alt="html" onerror="alert(1)">\n\n<!-- <img src="${original}/comment.png"> -->`;
  const { container } = render(<MDRender>{markdown}</MDRender>);
  expect(screen.getByAltText('markdown')).toHaveAttribute(
    'src',
    expected(source)
  );
  expect(screen.getByAltText('external')).toHaveAttribute(
    'src',
    'https://third.test/a.png'
  );
  const htmlImage = screen.getByAltText('html');
  expect(htmlImage).toHaveAttribute(
    'src',
    expected(`${original}/html.png!small?x=1&y=2#p`)
  );
  expect(htmlImage).toHaveAttribute(
    'srcset',
    `${expected(
      `${original}/small.png`
    )} 320w, https://third.test/large.png 640w`
  );
  expect(htmlImage).not.toHaveAttribute('onerror');
  expect(screen.getByText('link')).toHaveAttribute('href', source);
  expect(container.querySelector('code')?.textContent).toBe(
    `![code](${source})`
  );
  expect(container.textContent).toContain(`${original}/plain.png`);
  expect(container.querySelectorAll('img')).toHaveLength(3);
});

it('uses the same routed Markdown image during SSR', () => {
  const html = renderToString(<MDRender>{`![server](${source})`}</MDRender>);
  const container = document.createElement('div');
  container.innerHTML = html;
  expect(container.querySelector('img')).toHaveAttribute(
    'src',
    expected(source)
  );
});

it.each([
  [undefined, 'https://hellogithub.com/images/logo/meta.jpg'],
  [
    '/images/custom-share.png',
    'https://hellogithub.com/images/custom-share.png',
  ],
  [source, expected(source)],
  ['https://third.test/meta.png', 'https://third.test/meta.png'],
])(
  'renders absolute Open Graph/Twitter image URLs for %s during SSR',
  (image, url) => {
    const html = renderToString(<Seo {...(image ? { image } : {})} />);
    const container = document.createElement('div');
    container.innerHTML = html;
    expect(container.querySelector('[property="og:image"]')).toHaveAttribute(
      'content',
      url
    );
    expect(container.querySelector('[name="twitter:image"]')).toHaveAttribute(
      'content',
      url
    );
  }
);

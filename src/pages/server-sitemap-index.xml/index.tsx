// pages/server-sitemap-index.xml/index.tsx
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSideSitemapIndex } from 'next-sitemap';

import { getURLs } from '@/services/sitemap';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  // Method to source urls from cms
  const { req } = ctx;
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const data = await getURLs(ip);
  return getServerSideSitemapIndex(ctx, data?.data);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapIndex() {}

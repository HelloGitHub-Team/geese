// pages/server-sitemap-index.xml/index.tsx
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

import { getSitemap } from '@/services/home';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  // Method to source urls from cms
  const data = await getSitemap();
  const allURLs = data?.data.map((item) => {
    return {
      loc: item.loc,
      lastmod: item.lastmod,
      priority: item.priority,
      changefreq: item.changefreq,
    } as ISitemapField;
  });
  return getServerSideSitemap(ctx, allURLs);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapIndex() {}

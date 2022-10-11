// pages/server-sitemap-index.xml/index.tsx
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSideSitemapIndex } from 'next-sitemap';

import { getURLs } from '@/services/sitemap';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  // Method to source urls from cms
  const data = await getURLs();
  return getServerSideSitemapIndex(ctx, data?.data);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapIndex() {}

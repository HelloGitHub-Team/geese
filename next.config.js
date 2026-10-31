/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

module.exports = withBundleAnalyzer({
  i18n,
  // Freeze the empty domestic default too, for matching SSR/browser builds.
  env: {
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '',
    NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL:
      process.env.NEXT_PUBLIC_UPYUN_IMAGE_BASE_URL || '',
  },
  trailingSlash: false,
  reactStrictMode: false,
  compress: true, // 启用压缩
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'img.hellogithub.com' },
      { protocol: 'https', hostname: 'img-global.cheatsheet.store' },
      { protocol: 'https', hostname: 'img-upyun.cheatsheet.store' },
      { protocol: 'https', hostname: 'thirdwx.qlogo.cn' },
    ],
  },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    return config;
  },
});

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

module.exports = withBundleAnalyzer({
  i18n,
  reactStrictMode: false,
  compress: true, // 启用压缩
  eslint: {
    dirs: ['src'],
  },
  // Uncoment to add domain whitelist
  images: {
    domains: [
      'raw.githubusercontent.com',
      'img.hellogithub.com',
      'thirdwx.qlogo.cn',
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
      use: 'raw-loader',
    });
    return config;
  },
  // experimental: {
  //   disableOptimizedLoading: true,
  //   scrollRestoration: true,
  // },
});

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MillionLint = require('@million/lint');

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

const nextConfig = {
  rsc: true,
  filter: {
    include: "**/src/**/.{mtsx,mjsx,tsx,jsx}",
  },
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: false,

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
  //   scrollRestoration: true,
  // },
};

module.exports = MillionLint.next()(nextConfig);

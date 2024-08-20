/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  // !STARTERCONF Change the siteUrl
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  siteUrl: 'https://hellogithub.com',
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  exclude: [
    '/tachi',
    '/user/login',
    '/help',
    '*/search*',
    '*/periodical/statistics/click*',
  ],

  robotsTxtOptions: {
    additionalSitemaps: [
      'https://hellogithub.com/server-sitemap-index.xml', // <==== Add here
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '.jpg$',
          '.jpeg$',
          '.gif$',
          '.png$',
          '.bmp$',
          '/wp-admin/',
          '/wp-includes/',
          '/cgi-bin/',
          '/wp-content/plugins/',
          '/wp-content/themes/',
          '/wp-content/cache/',
          '/author/',
          '/trackback/',
          '/tachi/',
          '/user/',
          '/help/',
          '/search/',
          '/periodical/statistics/click/',
        ],
      },
      {
        userAgent: 'AhrefsBot',
        disallow: ['/'],
      },
      {
        userAgent: 'MJ12bot',
        disallow: ['/'],
      },
      {
        userAgent: 'SemrushBot',
        disallow: ['/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'DotBot',
        disallow: ['/'],
      },
    ],
  },
};

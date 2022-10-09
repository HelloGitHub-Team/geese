/* eslint-disable @typescript-eslint/no-var-requires */
const next = require('next');
const dev = process.env.NEXT_PUBLIC_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { parse } = require('url');

const express = require('express');
const expressRouter = express.Router();
const server = express();
// this is the logger for the server
var logger = require('pino-http')();

const NODE_PORT = process.env.NODE_PORT | 3000;

app.prepare().then(() => {
  expressRouter.get('*', (req, res) => {
    // 页面路由
    if (req.url.includes('//')) {
      return app.render(req, res, '/404');
    }
    logger(req, res);
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      return app.render(req, res, pathname.slice(0, -1), query);
    } else {
      return app.render(req, res, pathname, query);
    }
  });
  server.use('/', expressRouter);

  server.all('*', (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);

    return handle(req, res, parsedUrl);
  });

  server.listen(NODE_PORT, () =>
    console.log('App listening on port ' + NODE_PORT)
  );
});

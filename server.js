/* eslint-disable @typescript-eslint/no-var-requires */
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { parse } = require('url');

const express = require('express');
const expressRouter = express.Router();
const server = express();

const NODE_PORT = 8888;

app.prepare().then(() => {
  expressRouter.get('*', (req, res) => {
    // 页面路由
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
    console.log('pathname: ', pathname);
    return app.render(req, res, pathname, query);
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

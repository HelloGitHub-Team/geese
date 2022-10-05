/* eslint-disable @typescript-eslint/no-var-requires */
// const express = require('express')
// const next = require('next')

// const port = parseInt(process.env.NODE_PORT, 10) || 3000
// const dev = process.env.NEXT_PUBLIC_ENV !== 'production';
// const app = next({ dev })
// const handle = app.getRequestHandler()
// const pino = require('express-pino-logger')

// console.log(pino)
// app.prepare().then(() => {
//   const server = express()
//   server.use(pino)

//   server.all('*', (req, res) => {
//     req.log.info('something else')
//     return handle(req, res)
//   })

//   server.listen(port, () => {
//     console.log(`> Ready on http://localhost:${port}`)
//   })
// })

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
    logger(req, res);
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    if (pathname.endsWith('/')) {
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

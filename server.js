/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const next = require('next')

const port = parseInt(process.env.NODE_PORT, 10) || 3000
const dev = process.env.NEXT_PUBLIC_ENV !== 'production';
const app = next({ dev })
const handle = app.getRequestHandler()
var pino = require('express-pino-logger')
app.use(pino)

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})




// const { parse } = require('url');

// const express = require('express');
// const expressRouter = express.Router();
// const server = express();

// const NODE_PORT = process.env.NODE_PORT;

// app.prepare().then(() => {
//   expressRouter.get('*', (req, res) => {
//     // 页面路由
//     const parsedUrl = parse(req.url, true);
//     const { pathname, query } = parsedUrl;
//     console.log('process.env.NEXT_PUBLIC_ENV: ', process.env.NEXT_PUBLIC_ENV);
//     console.log('pathname: ', pathname);
//     return app.render(req, res, pathname, query);
//   });
//   server.use('/', expressRouter);

//   server.all('*', (req, res) => {
//     // Be sure to pass `true` as the second argument to `url.parse`.
//     // This tells it to parse the query portion of the URL.
//     const parsedUrl = parse(req.url, true);

//     return handle(req, res, parsedUrl);
//   });

//   server.listen(NODE_PORT, () =>
//     console.log('App listening on port ' + NODE_PORT)
//   );
// });

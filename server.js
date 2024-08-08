/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await app.prepare();
    const server = express();

    // 中间件处理尾部斜杠但不重定向
    server.use((req, res, next) => {
      if (req.url.length > 1 && req.url.endsWith('/')) {
        req.url = req.url.slice(0, -1);
      }
      next();
    });

    // 处理所有其他请求
    server.all('*', (req, res) => handle(req, res));

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

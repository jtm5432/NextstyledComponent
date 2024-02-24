const { parse } = require('url');
const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs');
const morgan = require('morgan');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = 4000;

const httpsOptions = {
  // key: fs.readFileSync(`${__dirname}/../../key.pem`),
  // cert: fs.readFileSync(`${__dirname}/../../cert.pem`),
  key: fs.readFileSync(`/home/zeniuslog/LMS/key.pem`),
  cert: fs.readFileSync(`/home/zeniuslog/LMS/cert.pem`),
};



app.prepare().then(() => {
  const server = express();

//   server.use('/_next/webpack-hmr', createProxyMiddleware({
//     target: 'http://localhost:8081/nextjs/dashboard',
//     changeOrigin: true,
//     ws: true,  // 웹소켓 연결 지원
//     logLevel: 'debug'
// }));
  
 
server.use('/_next/webpack-hmr', (req, res, next) => {
  return handle(req, res);  // Next.js의 기본 핸들러에 위임합니다.
});
const socketIoMiddleware = createProxyMiddleware('/myAppSocket/socket.io', {
  target: 'https://192.168.10.224:8081',
   ws: true,
   secure: false,  // This option checks if you trust the certificate (self-signed in this case)
  ssl: httpsOptions,
  pathRewrite: {
    '^/myAppSocket/socket.io': '/socket.io', // Remove '/myAppSocket/socket.io' from the path
  },
  onProxyReq: (proxyReq, req, res) => {
  //  console.log('Proxying request:', req.originalUrl);
   // console.log('Request headers:', proxyReq.user);
    // 여기서 필요한 다른 요청 정보를 로그로 남길 수 있습니다.
  }
  
 });
console.log('load',`${__dirname}/../../key.pem`)
server.use('/myAppSocket/socket.io', socketIoMiddleware);

server.use((req, res) => {
  const cidFromHeader = req.headers['cid'];
  console.log('cidFromHeader',cidFromHeader)
  //console.log('req.url',req)
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});
https
    .createServer(httpsOptions, server)
    .listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> HTTPS: Ready on https://localhost:${PORT}`);
    });
});

const symlinkPath = './public/renderSiem';
if (fs.existsSync(symlinkPath)) {
  try {
    fs.unlinkSync(symlinkPath);
    console.log('기존 심볼릭 링크가 성공적으로 삭제되었습니다.');
  } catch (err) {
    console.error('심볼릭 링크 삭제 중 오류 발생:', err);
    return;
  }
}

try {
  fs.symlinkSync('../../../render/', symlinkPath, 'dir');
  console.log('심볼릭 링크가 성공적으로 생성되었습니다.');
} catch (err) {
  console.error('심볼릭 링크 생성 중 오류 발생:', err);
}

const { parse } = require('url');
const next = require('next');

const https = require('https');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 4000;

const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/../../key.pem`),
  cert: fs.readFileSync(`${__dirname}/../../cert.pem`),
};

app.prepare().then(() => {
  // https 서버 추가
  https
    .createServer(httpsOptions, (req, res) => {		
      const parsedUrl = parse(req.url, true);
	  console.log('요청',parsedUrl, req.url);
      handle(req, res, parsedUrl);
    })
    .listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> HTTPS: Ready on https://localhost:${PORT}`);
    });
});

// try {
//   fs.symlinkSync('./public/render', '../../../render/', 'dir');
//   console.log('심볼릭 링크가 성공적으로 생성되었습니다.');
// } catch (err) {
//   console.error('심볼릭 링크 생성 중 오류 발생:', err);
// }
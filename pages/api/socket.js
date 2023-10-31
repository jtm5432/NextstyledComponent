// pages/api/socket.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: 'https://192.168.10.224:443', // 여기에 타겟 서버 주소를 입력합니다.
  changeOrigin: true,
  ws: true, // WebSocket을 위한 설정입니다.
  pathRewrite: {
    '^/api/socket': '/', // 필요에 따라 경로를 재작성합니다.
  },
  logLevel: 'debug', // 문제 해결을 위해 로그 레벨을 'debug'로 설정합니다.
});

export default (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end(); // preflight request. reply successfully:
    return;
  }
  return proxy(req, res);
};

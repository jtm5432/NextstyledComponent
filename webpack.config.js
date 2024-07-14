module.exports = {
    devServer: {
      hot: true,
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: 'all',
      client: {
        webSocketURL: {
          hostname: 'localhost',
          port: 3000,
          pathname: '/_next/webpack-hmr',
          protocol: 'wss:',
        },
      },
    },
  };
  
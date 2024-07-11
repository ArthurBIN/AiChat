const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/AiChat/'
})
// module.exports = {
//   devServer: {
//     https: true
//   }
// }
module.exports = {
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://tts.tencentcloudapi.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        onProxyReq: (proxyReq, req, res) => {
          proxyReq.setHeader('Host', 'tts.tencentcloudapi.com');
        }
      }
    }
  }
};
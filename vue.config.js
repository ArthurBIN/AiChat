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
};
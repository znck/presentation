/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  lintOnSave: false,
  /** @param {import('webpack-chain')} config */
  chainWebpack(config) {
    config.module
      .rule('slides')
      .test(/\.slides$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('slides-loader')
      .loader(require.resolve('./packages/slides-loader/lib/index.js'))
  },
};

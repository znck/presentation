module.exports = {
  chainWebpack(config) {
    config.module.rule('slides')
      .test(/\.slides$/)
      .use('vue-loader')
        .loader('vue-loader')
        .end()
      .use('slides-loader')
        .loader(require.resolve('./slides-loader'))
        .end()
  }
}

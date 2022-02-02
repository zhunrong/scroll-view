module.exports = (webpackConf, type) => {
  if (type === 'lib') {
    Object.assign(webpackConf.externals, {
      '@juggle/resize-observer': '@juggle/resize-observer'
    })
  }
  if (type === 'build') {
    Object.assign(webpackConf.output, {
      publicPath: '/scroll-view/'
    })
  }
}
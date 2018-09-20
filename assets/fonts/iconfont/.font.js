module.exports = {
  files: [
    './icons/*.svg'
  ],
  fontName: 'iconfont',
  cssTemplate: './templates/css.hbs',
  classPrefix: 'icon-',
  baseSelector: '.icon',
  types: ['eot', 'woff', 'woff2', 'ttf', 'svg'],
  fileName: '[fontname].[hash:7].[ext]',
  emitCodepoints: {
    fileName: '[fontname].codepoints.[hash:7].json',
    type: 'json'
  }
}

module.exports = ({ file, options, env }) => ({
  ident: 'postcss',
  sourceMap: env !== 'production',
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-preset-env': {
      autoprefixer: {
        browsers: ['>0.5%', 'last 2 versions', 'not dead'],
        cascade: false,
        grid: false
      }
    },
    'css-mqpacker': { sort: false },
    'cssnano': {
      preset: ['default', {
        discardComments: { removeAll: env === 'production' },
        normalizeWhitespace: { exclude: env !== 'production' }
      }]
    }
  }
})

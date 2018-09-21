const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MediaQueryPlugin = require('media-query-plugin')
const WebpackManifestPlugin = require('webpack-manifest-plugin')

const config = {
  path: {
    app: __dirname,
    src: path.join(__dirname, 'assets'),
    public: path.join(__dirname, 'public'),
    assets: path.join(__dirname, 'public', 'assets')
  }
}

module.exports = (env, argv) => {
  process.env.NODE_ENV = env || argv.mode || 'development'
  const debug = process.env.DEBUG = process.env.NODE_ENV !== 'production'

  const cssLoader = [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: debug,
        importLoaders: 1
      }
    },
    MediaQueryPlugin.loader,
    'postcss-loader'
  ]

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: debug,
      includePaths: [
        config.path.src,
        path.resolve(config.path.app, 'node_modules')
      ]
    }
  }

  return {
    mode: argv.mode || 'development',
    target: 'web',
    entry: {
      app: [
        './assets/javascripts',
        './assets/stylesheets',
        './assets/fonts/iconfont/.font'
      ],
      images: glob.sync('./assets/images/**', { nodir: true })
    },
    context: config.path.app,
    output: {
      filename: '[name].bundle.[contenthash:7].js',
      chunkFilename: '[name].[contenthash:7].bundle.js',
      path: config.path.assets
    },
    resolve: {
      modules: [
        config.path.src,
        path.join(config.path.app, 'node_modules')
      ],
      enforceExtension: false,
      extensions: ['.js', '.json', '.css', '.scss'],
      alias: {
        'images': path.join(config.path.src, 'images'),
        'stylesheets': path.join(config.path.src, 'stylesheets'),
        'javascripts': path.join(config.path.src, 'javascripts')
      }
    },
    node: {
      fs: 'empty'
    },
    performance: {
      hints: false
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: debug,
          cache: true,
          parallel: true,
          extractComments: !debug
        })
      ]
    },
    /*
    externals: {
      jquery: 'jQuery',
      'popper.js': 'Popper'
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules/, // new RegExp('node_modules' + '\\' + path.sep + 'jquery.*'),
            name: 'vendors',
            chunks: 'initial',
            enforce: true
          }
        }
      }
    },
    */
    devtool: debug && 'source-map',
    stats: {
      colors: true,
      children: false,
      modules: debug,
      hash: debug,
      reasons: debug,
      warnings: debug
    },
    module: {
      rules: [
        {
          test: /\.(js|es6)$/,
          include: [config.path.src],
          exclude: [/node_modules/],
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: cssLoader
        },
        {
          test: /\.scss$/,
          use: [
            ...cssLoader,
            sassLoader
          ]
        },
        {
          test: /\.(svg|woff|woff2|eot|ttf)$/,
          exclude: [
            path.join(config.path.src, 'images'),
            path.join(config.path.src, 'sprite')
          ],
          loader: 'url-loader',
          options: {
            limit: 9216,
            name: '[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          include: [path.join(config.path.src, 'image')],
          loader: 'file-loader',
          options: {
            name: '[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.svg$/,
          include: [path.join(config.path.src, 'sprite')],
          loader: 'svg-sprite-loader',
          options: {
            extract: false
          }
        },
        {
          test: /\.(wav|mp3)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.font\.js$/,
          use: [
            ...cssLoader,
            {
              loader: 'webfonts-loader',
              options: { publicPath: '/assets/' }
            }
          ]
        },
        {
          test: require.resolve('wowjs'),
          loader: 'exports-loader?this.WOW'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        'process.env.DEBUG': JSON.stringify(debug)
      }),
      new CleanWebpackPlugin([
        `${config.path.assets}/**`
      ], {
        root: __dirname,
        verbose: debug
      }),
      new SpriteLoaderPlugin({}),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.[contenthash:7].css',
        chunkFilename: '[name].[contenthash:7].css'
      }),
      new MediaQueryPlugin({}),
      new WebpackManifestPlugin({
        filter: file => (file.isChunk || file.isModuleAsset) && !/\.font\.js$/.test(file.name)
      })
    ]
  }
}

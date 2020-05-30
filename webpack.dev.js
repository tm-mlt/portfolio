const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  pages: path.join(__dirname, 'src/pages'),
  static: path.join(__dirname, 'static'),
  images: path.join(__dirname, 'static/images'),
};

const PAGES = glob
  .sync(`${PATHS.pages}/**/*.pug`)
  .map(file => path.relative(PATHS.pages, file));
console.log(PAGES);

module.exports = {
  entry: {
    main: `${PATHS.src}/index.js`
  },

  output: {
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js'
  },

  module: {
    rules: [
      {
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',

        options: {
          plugins: ['syntax-dynamic-import'],

          presets: [
            [
              '@babel/preset-env',
              {
                modules: false
              }
            ]
          ]
        },

        test: /\.js$/
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.(scss|css)$/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
          test: /\.jpe?g$|\.gif$|\.png$/i,
          loader: "file-loader",
          options: {
            publicPath: url => `/${url}`,
            name: '[path][name].[ext]',
          }
      }
    ]
  },


  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    //new CopyPlugin({
    //  patterns: [
    //    { from: 'source', to: 'dest' },
    //    { from: 'other', to: 'public' },
    //  ],
    //}),
    new MiniCssExtractPlugin(),
    ...PAGES.map(page => {
      const isProjects = page.search(/projects/) > -1;
      const basename = path.basename(page, '.pug');
      const filename = isProjects ? `projects/${basename}` : basename;
      return new HtmlWebpackPlugin({
        template: path.join(PATHS.pages, isProjects ? 'projects' : '', `${basename}.pug`),
        filename: filename === 'index' ? `index.html` : `${filename}/index.html`,
      });
    }),
  ],

  devServer: {
    contentBase: PATHS.static,
    compress: true,
    port: 8080
  },

  resolve: {
    alias: {
      '~images': PATHS.images,
    }
  }
};

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var info = require('./src/database/info');
var outputFolder = 'dist';
var publicPath = '/';

module.exports = {
  entry: './app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, outputFolder),
    publicPath: publicPath
  },
  resolve: {
    extensions: ['.js', '.json', '.styl'],
    alias: {
      utilities: path.resolve(__dirname, 'src/utilities/'),
      components: path.resolve(__dirname, 'src/components/'),
      templates: path.resolve(__dirname, 'src/templates/'),
      database: path.resolve(__dirname, 'src/database/'),
      images: path.resolve(__dirname, 'src/images/'),
      css: path.resolve(__dirname, 'src/css/'),
      ScrollToPlugin: 'gsap/src/uncompressed/plugins/ScrollToPlugin.js',
      ThrowPropsPlugin: path.resolve(
        __dirname,
        'src/vendors/ThrowPropsPlugin.js'
      )
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'imports-loader?define=>false'
      },
      {
        test: /\.(svg|ico|png|jpg|gif|woff|woff2|eot|ttf|otf|webm|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader', options: { minimize: true } }]
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  devServer: {
    historyApiFallback: { index: publicPath }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: info.title,
      description: info.description,
      template: 'src/templates/index.html',
      favNormal: '/src/images/favicon-16x16.png',
      favRetina: '/src/images/favicon-32x32.png'
    }),
    new ExtractTextPlugin('app.css'),
    new webpack.NamedModulesPlugin()
    //new UglifyJsPlugin()
  ]
};

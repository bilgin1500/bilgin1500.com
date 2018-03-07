var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var info = require('./src/database/info');
var outputFolder = 'dist';
var publicPath = '/';

module.exports = {
  entry: './app.js',
  output: {
    filename: 'app.[hash].js',
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
        'src/vendors/GSAP_Plugins/ThrowPropsPlugin.js'
      ),
      SplitText: path.resolve(
        __dirname,
        'src/vendors/GSAP_Plugins/SplitText.js'
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
              outputPath: 'assets/',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            }
          ]
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, outputFolder),
    port: 9000,
    historyApiFallback: { index: publicPath },
    open: true,
    hot: true,
    stats: 'minimal'
  },
  // https://webpack.js.org/configuration/stats/
  stats: {
    hash: false,
    version: false,
    timings: true,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { verbose: true }),
    new HtmlWebpackPlugin({
      title: info.title,
      description: info.description,
      template: 'src/templates/index.html',
      favNormal: '/assets/favicon-16x16.png',
      favRetina: '/assets/favicon-32x32.png'
    }),
    new ExtractTextPlugin('app.[hash].css'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new UglifyJsPlugin()
  ]
};

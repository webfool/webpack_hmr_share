const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin

module.exports = {
  mode: "development",
  devServer: {
    contentBase: './dist', // 除了打包文件之外，额外的资源文件
    hot: true
  },
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    hotUpdateGlobal: 'webpackHotUpdate'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new HotModuleReplacementPlugin()
  ]
}
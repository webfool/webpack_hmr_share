const webpack = require('webpack')
const webpackConfig = require('../webpack.config')
const Server = require('./server')

function startDevServer(compiler, config) {
  const devServerOptions = config.devServer || {}

  const server = new Server(compiler, devServerOptions)

  const {host = 'localhost', port = 8080} = devServerOptions
  server.listen(port, host, (err) => {
    console.log(`Project is running at http://${host}:${port}`)
  })
}

const compiler = webpack(webpackConfig)

startDevServer(compiler, webpackConfig)


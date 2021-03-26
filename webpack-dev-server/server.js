/**
 * - 启动一个服务器，用于请求 webpack 生成的资源文件
 * - 修改 webpack 的资源生成方式为生成到内存
 * - 监听 webpack 的 done hook，并传递给浏览器端
 * - 在打包文件中添加热更新相关的资源文件 
 */
const express = require('express')
const http = require('http')
const webpackDevMiddleware = require('../webpack-dev-middleware')
const WebsocketServer = require('socket.io')

class Server {
  constructor(compiler, devServerOptions) {
    this.compiler = compiler
    this.devServerOptions = devServerOptions

    this.sockets = []
    this.setupHooks()

    this.setupApp()
    this.setupDevMiddleware()
    this.createServer()
    this.createSocketServer()
  }

  // 监听 webpack 的编译完成事件，将最新的 hash 通知给浏览器端
  setupHooks() {
    this.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
      console.log('stats hash ->', stats.hash)
      this.sockets.forEach((socket) => {
        socket.emit('hash', stats.hash)
        socket.emit('ok')
      })
      this.stats = stats
    })
  }

  setupApp() {
    this.app = new express()
  }

  setupDevMiddleware() {
    // 允许配置其它目录作为静态资源目录
    if (this.devServerOptions.contentBase) {
      this.app.use(express.static(this.devServerOptions.contentBase))
    }
    
    // 创建一个将请求导向 webpack 输出目录的中间件
    const middleware = webpackDevMiddleware(this.compiler)
    this.app.use(middleware)
  }

  createServer() {
    this.server = http.createServer(this.app)
  }

  // 创建 socket 服务
  createSocketServer() {
    const io = WebsocketServer(this.server)
    io.on('connection', (socket) => {
      console.log('client connected')
      this.sockets.push(socket)

      socket.on('disconnect', () => {
        const index = this.sockets.indexOf(socket)
        this.sockets.splice(index, 1)
      })

      if (this.stats) {
        socket.emit('hash', this.stats.hash)
        socket.emit('ok')
      }
    })
  }

  listen(port, host, callback = () => {}) {
    this.server.listen(port, host, callback)
  }
}

module.exports = Server
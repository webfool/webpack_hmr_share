const MemoryFileSystem = require('memory-fs')
const memoryFileSystem = new MemoryFileSystem()
const middleware = require('./middleware')

function webpackDevMiddleware(compiler) {
  // 启动 webpack 的编译
  compiler.watch({}, (err, stats) => {
    console.log('start watching')
  })

  // 将 webpack 的输入方式改为输出到内存
  const fs = compiler.outputFileSystem = memoryFileSystem
  const outputPath = compiler.options.output.path

  return middleware({fs, outputPath})
}

module.exports = webpackDevMiddleware
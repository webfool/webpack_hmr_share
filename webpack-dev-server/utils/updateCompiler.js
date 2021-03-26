
module.exports = function(compiler) {
  const config = compiler.options
  // 为 main 的 entry 添加额外的文件
  config.entry.main.import.unshift(require.resolve('../client/index.js'))
  config.entry.main.import.unshift(require.resolve('../client/dev-server.js'))

  // 重新调用 compiler 的 entryOption 钩子
  compiler.hooks.entryOption.call(config.context, config.entry)
}
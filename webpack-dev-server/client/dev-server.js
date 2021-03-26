console.log('client: dev-server.js')
const hotEmitter = require('./emitter')

hotEmitter.on('webpackHotUpdate', (hash) => {
  console.log('in client dev-server hash ->', hash)
})
// 注入浏览器端，用于启动并监听 socket 的代码
console.log('client: index.js')
const hotEmitter = require('./emitter')

const socket = io()

let currentHash
socket.on('hash', (hash) => {
  currentHash = hash
})

socket.on('ok', () => {
  hotEmitter.emit('webpackHotUpdate', currentHash)
})
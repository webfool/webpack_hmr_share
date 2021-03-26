console.log('client: dev-server.js')
const hotEmitter = require('./emitter')

let currentHash
let lastHash
function hotCheck() {
  hotDownloadManifest().then(res => {
    console.log('hot-update.json ->', res)
  })
}

function hotDownloadManifest() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', `main.${lastHash}.hot-update.json`)
    xhr.onload = function() {
      resolve(JSON.parse(xhr.responseText))
    }
    xhr.onerror = function(e) {
      reject(e)
    }
    xhr.send()
  })
}

hotEmitter.on('webpackHotUpdate', (hash) => {
  console.log('in client dev-server hash ->', hash)
  if (!lastHash) {
    lastHash = hash
    return
  }

  currentHash = hash
  hotCheck()
})
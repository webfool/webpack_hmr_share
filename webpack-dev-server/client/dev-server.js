console.log('client: dev-server.js')
const hotEmitter = require('./emitter')

let currentHash
let lastHash
function hotCheck() {
  hotDownloadManifest().then(res => {
    console.log('hot-update.json ->', res)
    res.c.forEach(chunkId => {
      hotDownloadUpdateChunk(chunkId)
    })
    lastHash = currentHash
  })
}

// 加载资源变化清单
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

// 通过 jsonp 加载变化模块资源
function hotDownloadUpdateChunk(chunkId) {
  const script = document.createElement('script')
  script.src = `${chunkId}.${lastHash}.hot-update.js`
  document.head.appendChild(script)
}

self['webpackHotUpdate'] = function(chunkId, updatedModules) {
  console.log('chunkId ->', chunkId)
  console.log('updateModules ->', updatedModules)

  const modules = __webpack_modules__
  const cache = __webpack_module_cache__

  for (let moduleId in updatedModules) {
    modules[moduleId] = updatedModules[moduleId]
    const parents = cache[moduleId].parents
    delete cache[moduleId]
    parents.forEach(f => {
      cache[f].hot._acceptedDependencies[moduleId]()
    })
  }
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
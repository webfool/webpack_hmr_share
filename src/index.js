function render() {
  const title = require('./title')
  root.innerHTML = title
}

render()
console.log('aaabbb')

if (module.hot) {
  module.hot.accept(['./title'], function() {
    render()
  })
}
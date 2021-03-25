function render() {
  const title = require('./title')
  root.innerHTML = title
}

render()

if (module.hot) {
  module.hot.accept(['./title'], function() {
    render()
  })
}
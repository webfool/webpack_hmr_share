const path = require('path')
const mime = require('mime')

module.exports = function(context) {
  return function(req, res, next) {
    const {fs, outputPath} = context
    const url = req.url === '/' ? 'index.html' : req.url

    const filename = path.join(outputPath, url)
    try {
      const stat = fs.statSync(filename)
      if (stat.isFile()) {
        const content = fs.readFileSync(filename)
        res.setHeader('Content-Type', mime.getType(filename))
        res.send(content)
      } else {
        res.sendStatus(404)
      }
    } catch(e) {
      res.sendStatus(404)
    }
  }
}
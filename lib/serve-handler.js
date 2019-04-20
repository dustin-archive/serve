
const fs = require('fs')
const path = require('path')

const directory = path.join(process.cwd(), 'public')
const index = path.join(directory, 'index.html')

const mime = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
}

const send = (res, code) => {
  res.setHeader('content-type', 'text/plain')
  res.statusCode = code
  res.end()
}

const handler = (req, res) => {
  const file = path.join(directory, req.url)
  let extension = path.extname(file)

  const stream = (file, handler) => {
    res.setHeader('content-type', mime[extension] || 'text/plain')
    fs.createReadStream(file).on('error', handler).pipe(res)
  }

  res.setHeader('access-control-allow-origin', '*')

  if (extension === '') {
    extension = '.html'
    stream(file + '.html', () => stream(index, () => send(res, 500)))
    return // stop execution
  }

  stream(file, () => send(res, 404))
}

module.exports = { handler }

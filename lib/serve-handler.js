
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

const handler = (req, res) => {
  const file = path.join(directory, req.url)
  let ext = path.extname(file)

  const write = (file, code, callback) => {
    res.setHeader('content-type', mime[ext] || 'text/plain')

    const stream = fs.createReadStream(file)

    stream.on('error', () => {
      if (callback) {
        callback()
        return // stop execution
      }

      res.writeHead(code)
      res.end()
    })

    stream.pipe(res)
  }

  res.setHeader('access-control-allow-origin', '*')

  if (ext === '') {
    write(file + (ext = '.html'), null, () => write(index, 500))
    return // stop execution
  }

  write(file, 404)
}

module.exports = { handler }

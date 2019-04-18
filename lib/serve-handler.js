
const fs = require('fs')
const path = require('path')

const directory = path.join(process.cwd(), 'public')
const index = path.join(directory, 'index.html')

const mime = {
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
}

const handler = (request, response) => {
  response.setHeader('access-control-allow-origin', '*')
  response.setHeader('content-type', 'text/html')

  let filePath = index

  const requestPath = path.join(directory, request.url)
  const extension = path.extname(requestPath)

  if (extension === '') {
    if (fs.existsSync(requestPath + '.html') === true) {
      filePath = requestPath + '.html'
    }
  } else {
    if (fs.existsSync(requestPath) === true) {
      response.setHeader('content-type', mime[extension] || 'text/plain')
      filePath = requestPath
    } else {
      response.statusCode = 404
      response.end()
      return // stop execution
    }
  }

  fs.createReadStream(filePath).pipe(response)
}

module.exports = { handler }

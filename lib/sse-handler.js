
const crypto = require('crypto')

const clients = new Map()

const reload = () => {
  for (let [key] of clients) {
    clients.get(key).write('data:reload\n\n')
  }
}

const handler = (request, response) => {
  response.setHeader('Content-Type', 'text/event-stream')

  const id = crypto.randomBytes(6).toString('hex')

  clients.set(id, response)
  response.write('data:connect\n\n')

  const heartbeat = setInterval(() => response.write(':\n\n'), 90000)

  response.on('aborted', () => {
    clearInterval(heartbeat)
    clients.delete(id)
  })
}

module.exports = { handler, reload }

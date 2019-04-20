
const crypto = require('crypto')

const clients = new Map()

const reload = () => {
  for (let [key] of clients) {
    clients.get(key).write('data:reload\n\n')
  }
}

const handler = res => {
  res.setHeader('content-yype', 'text/event-stream')

  const id = crypto.randomBytes(6).toString('hex')

  clients.set(id, res)
  res.write('data:connect\n\n')

  const heartbeat = setInterval(() => res.write(':\n\n'), 90000)

  res.on('aborted', () => {
    clearInterval(heartbeat)
    clients.delete(id)
  })
}

module.exports = { handler, reload }

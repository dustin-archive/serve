#!/usr/bin/env node

const fs = require('fs')
const http = require('http')

const args = require('../lib/parse-argv')(process.argv)
const exec = require('../lib/exec')
const reload = require('../lib/reload-handler')
const serve = require('../lib/serve-handler')

const flags = ['--bang', '--port', '--watch']

const bang = args['--bang']
const dirs = args['--watch']
const port = args['--port'] || 3000

const name = 'whaaaley/serve version 0.3.0'
const host = 'http://localhost:' + port

const server = http.createServer((req, res) => {
  if (req.url === '/reload') {
    reload.handler(res)
    return // stop execution
  }

  serve.handler(req, res)
})

const listener = (_eventType, filename) => {
  for (let key in args) {
    if (flags.includes(key) === true) {
      continue // next iteration
    }

    if (filename.endsWith('.' + key.slice(2)) === true) {
      exec(args[key])
    }
  }
}

server.listen(port, () => {
  if (typeof bang === 'string') { // optional
    exec(bang)
  }

  if (Array.isArray(dirs) === true) { // optional
    for (let i = 0; i < dirs.length; i++) {
      fs.watch(dirs[i], { recursive: true }, listener)
    }
  }

  console.log(name + '\nRunning at ' + host + '\n')
})

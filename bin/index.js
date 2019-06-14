#!/usr/bin/env node

const fs = require('fs')
const http = require('http')

const args = require('../lib/parse-argv')(process.argv)
const exec = require('../lib/exec')
const reload = require('../lib/reload-handler')
const serve = require('../lib/serve-handler')

const flags = ['--bang', '--port', '--watch']
const dirs = args['--watch']
const port = args['--port'] || 3000

const server = http.createServer((req, res) => {
  if (req.url === '/reload') {
    reload.handler(res)
    return // stop execution
  }

  serve.handler(req, res)
})

const listener = (_, filename) => {
  for (let key in args) {
    if (flags.includes(key) === true) {
      continue // next iteration
    }

    if (filename.endsWith('.' + key.slice(2))) {
      exec(args[key])
    }
  }
}

server.listen(port, () => {
  exec(args['--bang'])

  for (let i = 0; i < dirs.length; i++) {
    fs.watch(dirs[i], { recursive: true }, listener)
  }

  console.log('\nRunning at http://localhost:' + port + '\n')
})

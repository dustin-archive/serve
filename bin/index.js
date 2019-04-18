#!/usr/bin/env node

const fs = require('fs')
const http = require('http')

const args = require('../lib/parse-argv')(process.argv)
const exec = require('../lib/exec')
const reload = require('../lib/reload-handler')
const serve = require('../lib/serve-handler')

const server = http.createServer((request, response) => {
  if (request.url === '/reload') {
    reload.handler(response)
    return // stop execution
  }

  serve.handler(request, response)
})

const listener = (e, filename) => {
  for (let key in args) {
    if (key !== '--watch' && filename.endsWith('.' + key.slice(2))) {
      exec(args[key])
    }
  }
}

server.listen(3000, () => {
  const dirs = args['--watch']

  for (let i = 0; i < dirs.length; i++) {
    fs.watch(dirs[i], { recursive: true }, listener)
  }

  console.log('\nRunning at http://localhost:3000\n')
})

#!/usr/bin/env node

const fs = require('fs')
const http = require('http')
const handler = require('serve-handler')

const args = require('../lib/parse-argv')(process.argv)
const sse = require('../lib/sse-handler')
const spawn = require('../lib/spawn')

const server = http.createServer((request, response) => {
  if (request.url === '/reload') {
    return sse.handler(request, response)
  }

  return handler(request, response, {
    public: 'public',
    rewrites: [{ source: '**', destination: '/index.html' }]
  })
})

const listener = (e, filename) => {
  for (let key in args) {
    if (key !== '--watch' && filename.endsWith('.' + key.slice(2))) {
      spawn(args[key])
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

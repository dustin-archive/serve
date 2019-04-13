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

const options = {
  recursive: true
}

const listener = (e, filename) => {
  if (filename.endsWith('.scss')) {
    spawn(args['--css'])
    return // stop execution
  }

  if (filename.endsWith('.js')) {
    spawn(args['--js'])
  }
}

server.listen(3000, () => {
  const dirs = args['--watch']

  for (let i = 0; i < dirs.length; i++) {
    fs.watch(dirs[i], options, listener)
  }

  console.log('\nRunning at http://localhost:3000\n')
})

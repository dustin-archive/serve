
const child_process = require('child_process') // eslint-disable-line
const log = require('./log')
const reload = require('./reload-handler')

const exec = command => {
  const process = child_process.exec(command, { stdio: 'inherit' })

  process.stdout.on('data', data => {
    log(command, data)
  })

  process.on('close', reload.reload)
}

module.exports = exec

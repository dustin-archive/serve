
const child_process = require('child_process') // eslint-disable-line
const log = require('./log')
const reload = require('./reload-handler')

const exec = command => {
  const handler = (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      return // stop execution
    }

    log(command, stdout || stderr)
  }

  const process = child_process.exec(command, { stdio: 'inherit' }, handler)

  process.on('close', reload.reload)
}

module.exports = exec

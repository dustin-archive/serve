
const child_process = require('child_process') // eslint-disable-line

const sse = require('./sse-handler')
const log = require('./log')

const spawn = command => {
  const handler = (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      return // stop execution
    }

    log(command, stdout || stderr)
  }

  const process = child_process.exec(command, { stdio: 'inherit' }, handler)

  process.on('close', sse.reload)
}

module.exports = spawn

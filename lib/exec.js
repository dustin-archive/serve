
const child_process = require('child_process') // eslint-disable-line
const log = require('./log')
const reload = require('./reload-handler')

const exec = command => {
  const proc = child_process.exec(command, error => {
    if (error) console.log(error)
  })

  let output = ''

  const handler = data => { output += data }

  proc.stdout.on('data', handler)
  proc.stderr.on('data', handler)

  proc.on('close', () => {
    log(command, output)
    reload.reload()
  })
}

module.exports = exec

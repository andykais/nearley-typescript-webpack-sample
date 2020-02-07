const { getOptions } = require('loader-utils')
const validateOptions = require('schema-utils')
const path = require('path')
const { spawn } = require('child_process')

const schema = {}

module.exports = async function(source) {
  const options = getOptions(this)

  validateOptions(schema, options, 'Example Loader')

  console.log({ source })

  const command = path.resolve(__dirname, '..', 'node_modules', '.bin', 'nearleyc')

  const grammarToJs = await new Promise((resolve, reject) => {
    const nearleyc = spawn(command, [])
    const stdout = []
    const stderr = []

    nearleyc.on('close', code => {
      if (code === 0) {
        const stdoutStr = Buffer.concat(stdout).toString()
        resolve(stdoutStr)
      } else {
        const stderrStr = Buffer.concat(stderr).toString()
        reject(`${command} failed with exit code ${code} and error message:\n${stderrStr}`)
      }
    })

    nearleyc.stdout.on('data', data => {
      stdout.push(data)
    })
    nearleyc.stderr.on('data', data => {
      stderr.push(data)
    })

    nearleyc.stdin.write(source)
    nearleyc.stdin.end()
  })

  return grammarToJs
}

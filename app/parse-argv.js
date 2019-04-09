
const parse = argv => {
  const result = {}

  for (let i = 2; i < argv.length; i += 2) {
    result[argv[i]] = argv[i + 1]
  }

  return result
}

module.exports = parse

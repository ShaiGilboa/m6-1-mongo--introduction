const fs = require('file-system')

const greetings = JSON.parse(fs.readFileSync('data/greetings.json'));

const batchImport = () => {
  console.log('greetings',greetings)
}

batchImport()
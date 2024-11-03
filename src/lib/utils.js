const fs = require('fs')

async function ensureDirectoryExists(directory) {
  try {
    await fs.promises.access(directory)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.mkdir(directory, { recursive: true })
    } else {
      throw error
    }
  }
}

module.exports = {
  ensureDirectoryExists
}

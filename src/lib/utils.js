const fs = require('fs')
const path = require('path')

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

async function writeSubmissionToDisk(directory, data) {
  const uploadedFile = path.join(directory, `${Date.now()}-${data.filename}`)
  await fs.promises.writeFile(uploadedFile, data.file)
  return uploadedFile
}

module.exports = {
  ensureDirectoryExists,
  writeSubmissionToDisk
}

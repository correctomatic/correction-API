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

async function moveToUploadsDir(uploadsDirectory, filename) {
  const source = filename
  const basename = path.basename(filename)
  const destination = path.join(uploadsDirectory, basename)

  fs.promises.rename(source, destination)
  return destination
}


function renameProperty(obj, from, to) {
  let res = {
    ...obj,
    [to]: obj[from],
  }
  delete res[from]
  return res
}

function userNameToUser(entity) {
  return renameProperty(entity.dataValues, 'username', 'user')
}

module.exports = {
  ensureDirectoryExists,
  moveToUploadsDir,
  userNameToUser
}

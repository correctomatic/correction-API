import fs from 'fs'

const ensureDirectoryExists = async (directory) => {
  try {
    await fs.promises.access(directory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.mkdir(directory, { recursive: true });
    } else {
      throw error;
    }
  }
}

export {
  ensureDirectoryExists
}

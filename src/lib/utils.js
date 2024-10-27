import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

function scriptDir(meta) {
  const filename = fileURLToPath(meta.url);
  return dirname(filename);
}

async function ensureDirectoryExists(directory) {
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
  ensureDirectoryExists,
  scriptDir
}

'use strict'

const fs = require('fs')
const csv = require('csv-parser')

const parseCSV = async (filePath) => {
  const data = []

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', resolve)
      .on('error', reject)
  })

  return data
}

module.exports = parseCSV

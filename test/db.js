let db

function setDB(newDB) {
  db = newDB
}

function getDB() {
  return db
}

console.log('******************************')
console.log('db.js')
console.log('******************************')

module.exports = {
  setDB,
  getDB
}

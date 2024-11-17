const env = require('../src/config/env')

const config = {
  development: {
    username: env.db.username,
    password: env.db.password,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    // logging: true,
  },
  test: {
    username: 'correctomatic_test',
    password: 'correctomatic_test',
    database:  'correctomatic_test',
    host: '127.0.0.1',
    port: 54321,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: env.db.username,
    password: env.db.password,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    // logging: true,
  },
}

module.exports = config

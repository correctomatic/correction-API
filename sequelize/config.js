const env = require('../src/config/env')

const config = {
  development: {
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    // logging: true,
  },
  test: {
    username: 'correctomatic_test',
    password: 'correctomatic_test',
    database:  'correctomatic_test',
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    // logging: true,
  },
}

module.exports = config

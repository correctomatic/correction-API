require('dotenv').config()

const config = {
  development: {
    username: process.env.DB_USER || 'correctomatic',
    password: process.env.DB_PASSWORD || 'correctomatic',
    database: process.env.DB_NAME || 'correctomatic',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
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
    username: process.env.DB_USER || 'correctomatic',
    password: process.env.DB_PASSWORD || 'correctomatic',
    database: process.env.DB_NAME || 'correctomatic',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
}

module.exports = config

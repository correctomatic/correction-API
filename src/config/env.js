const dotenv = require('dotenv')
dotenv.config()

const DEFAULT_PORT = 3000

const DEFAULT_ENVIRONMENT = 'production'

const DEFAULT_LOG_LEVEL = 'info'
const DEFAULT_LOG_FILE = 1 // stdout

const DEFAULT_UPLOAD_DIRECTORY = '/tmp/uploads'

const REDIS_DEFAULTS = {
  host: 'localhost',
  port: 6379,
  user: 'default',
  password: '',
}

const DB_DEFAULTS = {
  db_name: 'correctomatic',
  host: 'localhost',
  port: 5432
}

const PENDING_QUEUE = 'pending_corrections'


function validateEnv(requiredEnvKeys) {
  const missingKeys = requiredEnvKeys.filter(key => {
    const value = process.env[key]
    return value === undefined || value === null || value.trim() === ''
  })

  if (missingKeys.length > 0) {
    throw new Error(`The following environment variables are missing or empty: ${missingKeys.join(', ')}`)
  }
}

const REQUIRED_ENV_KEYS = [
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET_KEY',
]

validateEnv(REQUIRED_ENV_KEYS)

const redisConfig = {
  host: process.env.REDIS_HOST || REDIS_DEFAULTS.host,
  port: process.env.REDIS_PORT || REDIS_DEFAULTS.port,
  username: process.env.REDIS_USER || REDIS_DEFAULTS.user,
  password: process.env.REDIS_PASSWORD || REDIS_DEFAULTS.password,
}

module.exports = {
  ENVIRONMENT: process.env.NODE_ENV || DEFAULT_ENVIRONMENT,
  PORT: process.env.PORT || DEFAULT_PORT,

  log: {
    LOG_LEVEL: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
    LOG_FILE: process.env.LOG_FILE || DEFAULT_LOG_FILE,
  },

  bullMQ: {
    QUEUE_NAME: process.env.QUEUE_NAME || PENDING_QUEUE,
    QUEUE_CONFIG: {
      connection: redisConfig,
    }
  },

  db: {
    host: process.env.DB_HOST || DB_DEFAULTS.host,
    port: process.env.DB_PORT || DB_DEFAULTS.port,
    database: process.env.DB_NAME || DB_DEFAULTS.db_name,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  UPLOAD_DIRECTORY: process.env.UPLOAD_DIRECTORY || DEFAULT_UPLOAD_DIRECTORY,

  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expiration: process.env.JWT_EXPIRES_IN || '1h',
  },
}

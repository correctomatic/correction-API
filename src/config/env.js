import dotenv from 'dotenv'
dotenv.config()

const DEFAULT_PORT = 3000

const DEFAULT_ENVIRONMENT = 'production'

const DEFAULT_LOG_LEVEL = 'info'
const DEFAULT_LOG_FILE = 'correctomatic.log'

const DEFAULT_UPLOAD_DIRECTORY = '/tmp/uploads'

const REDIS_DEFAULTS = {
  host: 'localhost',
  port: 6379,
  user: 'default',
  password: '',
}
const PENDING_QUEUE = 'pending_corrections'

const redisConfig = {
  host: process.env.REDIS_HOST || REDIS_DEFAULTS.host,
  port: process.env.REDIS_PORT || REDIS_DEFAULTS.port,
  username: process.env.REDIS_USER || REDIS_DEFAULTS.user,
  password: process.env.REDIS_PASSWORD || REDIS_DEFAULTS.password,
}

export default {
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
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  UPLOAD_DIRECTORY: process.env.UPLOAD_DIRECTORY || DEFAULT_UPLOAD_DIRECTORY
}

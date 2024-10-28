import dotenv from 'dotenv'
dotenv.config()

const DEFAULT_PORT: number = 3000
const DEFAULT_ENVIRONMENT: string = 'production'
const DEFAULT_LOG_LEVEL: string = 'info'
const DEFAULT_LOG_FILE: string = 'correctomatic.log'
const DEFAULT_UPLOAD_DIRECTORY: string = '/tmp/uploads'

interface RedisConfig {
  host: string
  port: number
  user: string
  password: string
}

const REDIS_DEFAULTS: RedisConfig = {
  host: 'localhost',
  port: 6379,
  user: 'default',
  password: '',
}

const PENDING_QUEUE: string = 'pending_corrections'

const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || REDIS_DEFAULTS.host,
  port: Number(process.env.REDIS_PORT) || REDIS_DEFAULTS.port,
  user: process.env.REDIS_USER || REDIS_DEFAULTS.user,
  password: process.env.REDIS_PASSWORD || REDIS_DEFAULTS.password,
}

export default {
  ENVIRONMENT: process.env.NODE_ENV || DEFAULT_ENVIRONMENT,
  PORT: Number(process.env.PORT) || DEFAULT_PORT,

  log: {
    LOG_LEVEL: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
    LOG_FILE: process.env.LOG_FILE || DEFAULT_LOG_FILE,
  },

  bullMQ: {
    QUEUE_NAME: process.env.QUEUE_NAME || PENDING_QUEUE,
    QUEUE_CONFIG: {
      connection: redisConfig,
    },
  },

  UPLOAD_DIRECTORY: process.env.UPLOAD_DIRECTORY || DEFAULT_UPLOAD_DIRECTORY,
}

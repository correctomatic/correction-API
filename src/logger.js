const pino = require('pino')
const env = require('./config/env')

const environment = env.ENVIRONMENT
const logLevel = env.log.LOG_LEVEL
const logFile = env.log.LOG_FILE

targets = [
  {
    level: logLevel,
    target: 'pino/file',
    options: {
      destination: logFile, // Default is 1 (stdout)
    }
  }
]

if (environment === 'development') {
  targets = [
    {
      level: logLevel,
      target: 'pino-pretty',
      options: {},
    },
  ]
}

const transport = pino.transport({
  targets
})

const logger = pino({
  level: logLevel,
},transport)

module.exports = logger

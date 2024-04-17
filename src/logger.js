import pino from 'pino'

const environment = process.env.NODE_ENV || 'development'
const logLevel = process.env.LOG_LEVEL || 'info'
const logFile = process.env.LOG_FILE || 'correctomatic.log'

let targets = []
if (environment === 'development') {
  targets = [
    {
      level: logLevel,
      target: 'pino-pretty',
      options: {},
    },
  ]
} else {
  targets = [
    {
      level: logLevel,
      target: 'pino/file',
      options: {
        destination: logFile,
      },
    },
  ]
}

const transport = pino.transport({
  targets
})

const logger = pino({
  level: logLevel,
},transport)

export default logger

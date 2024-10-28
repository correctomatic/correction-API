import pino, { TransportTargetOptions } from 'pino'
import env from './config/env.js'

const environment: string = env.ENVIRONMENT
const logLevel: string = env.log.LOG_LEVEL
const logFile: string = env.log.LOG_FILE

let targets: TransportTargetOptions[] = []
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

const logger = pino(
  {
    level: logLevel,
  },
  transport
)

export default logger

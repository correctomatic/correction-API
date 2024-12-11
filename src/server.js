import fs from 'fs'
import os from 'os'
import path from 'path'

import Fastify from 'fastify'
import AutoLoad from '@fastify/autoload'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'
import { swaggerOptions, swaggerUiOptions } from './swagger.js'
import { pipeline } from 'stream/promises'
import logger from './logger.js'
import dbConnector from './plugins/sequelize.js'
import AjvErrors from 'ajv-errors'

const fastify = Fastify({
  logger,
  ajv: {
    customOptions: { allErrors: true, strict: false, removeAdditional: false },
    plugins: [
      [AjvErrors]
    ]
  }
})

const __dirname = path.dirname(new URL(import.meta.url).pathname)

// This function is called for each file in the multipart form, will write
// the file to a temporary location so it don't be stored in memory
// The name of the file will be available in the request as `file`
async function onFile(part) {
  const req = this // you have access to original request via `this`

  const tempFilename = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}-${part.filename}`
  const tempFilePath = path.join(os.tmpdir(), tempFilename)

  req.file = tempFilePath
  await pipeline(part.file, fs.createWriteStream(tempFilePath))
}

fastify.register(fastifySwagger, swaggerOptions)
fastify.register(fastifySwaggerUi, swaggerUiOptions)
fastify.register(fastifyCors, { origin: '*' })
fastify.register(multipart, { attachFieldsToBody: true, onFile })

fastify.register(dbConnector, { logging: (msg) => logger.info(msg) })

// Routes MUST be loaded after the dbConnector plugin
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
})

export default fastify

import fs from 'fs'
import path from 'path'
import env from '../env.js'

import logger from '../logger.js'
// TO-DO: Schemas are not working for multipart forms
// import { GRADE_SCHEMA } from '../schemas/grade_schemas.js'

import { ensureDirectoryExists } from '../lib/utils.js'
import { getMessageChannel, PENDING_QUEUE } from '../rabbitmq_connection.js'

const UPLOAD_DIRECTORY =  env.UPLOAD_DIRECTORY


// Module initialization
ensureDirectoryExists(UPLOAD_DIRECTORY)

function image(name, tag) { return `${name}:${tag ?? 'latest'}` }

async function writeFileToDisk(data) {
  const uploadedFile = path.join(UPLOAD_DIRECTORY,`${Date.now()}-${data.filename}`)
  await fs.promises.writeFile(uploadedFile, data.file)
  return uploadedFile
}

// We reuse the connection to the message queue
let channel = null
async function getChannel() {
  if(channel) return channel
  return channel = await getMessageChannel()
}

async function putInPendingQueue(message) {
  const channel = await getChannel()
  const messageBuffer = Buffer.from(JSON.stringify(message))
  channel.sendToQueue(PENDING_QUEUE, messageBuffer, { persistent: true })
  // console.log('Message sent to running queue')
}

async function routes(fastify, _options) {

  // This API enqueues the result

  // Expected parameters:
  // - work_id: caller's id of the exercise
  // - assignment_id: assignment id of the exercise. This is for computing the docker image for the correction
  // - file: file with the exercise
  // - callback: URL to call with the results

  // Returns:
  // - success: boolean
  // - message: string ('Work enqueued for grading' or 'Error grading work')

  fastify.post(
    '/grade',
    // TO-DO: this generates "body must be object" error
    // { schema: GRADE_SCHEMA },
    async (req, _reply) => {

      try {
        const data = await req.file()
        const uploadedFile = await writeFileToDisk(data)

        // This MUST be after reading the file
        const work_id = data.fields.work_id.value
        const assignment_id = data.fields.assignment_id.value
        const callback = data.fields.callback.value

        // TODO: need a list of exercises / images
        // At the moment we use assignment_id, but this is a security risk
        // const containerImage = image('correction-test-1')
        const containerImage = image(assignment_id)

        // Put the mensage in the queue
        const message = {
          work_id,
          image: containerImage,
          file: uploadedFile,
          callback
        }

        await putInPendingQueue(message)
        logger.info('Work enqueued for grading:'+ JSON.stringify(message))

        return {
          success: true,
          message: 'Work enqueued for grading'
        }
      }catch(e) {
        logger.error('Error grading work:'+ JSON.stringify(e))
        return {
          success: false,
          message: 'Error grading work'
        }
      }
    }
  )
}

export default routes




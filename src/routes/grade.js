import fs from 'fs'
import path from 'path'
import env from '../config/env.js'

import logger from '../logger.js'
// TO-DO: Schemas are not working for multipart forms
// import { GRADE_SCHEMA } from '../schemas/grade_schemas.js'

import { ensureDirectoryExists } from '../lib/utils.js'
import { putInPendingQueue } from '../lib/bullmq.js'

const UPLOAD_DIRECTORY =  env.UPLOAD_DIRECTORY


// Module initialization
ensureDirectoryExists(UPLOAD_DIRECTORY)

function image(name, tag) { return `${name}:${tag ?? 'latest'}` }

async function writeFileToDisk(data) {
  const uploadedFile = path.join(UPLOAD_DIRECTORY,`${Date.now()}-${data.filename}`)
  await fs.promises.writeFile(uploadedFile, data.file)
  return uploadedFile
}

function checkFile(_req, reply, data) {
  if (!data) {
    reply.code(400).send({
      success: false,
      message: 'No file received',
    })
    return false
  }
  return true
}

function safeGetField(fields, name) {
  return fields[name]?.value
}

function checkFields(_req, reply, fields) {
  const assignment_id = safeGetField(fields, 'assignment_id')
  const callback = safeGetField(fields, 'callback')
  if (!assignment_id || !callback) {
    reply.code(400).send({
      success: false,
      message: `Missing required fields:${!assignment_id ? ' assignment_id' : ''}${!callback ? ' callback' : ''}`
    })
    return false
  }
  return true
}

async function preValidateGrade(req, reply) {
  try {
    const data = await req.file()
    if(!checkFile(req, reply, data)) return
    req.fileData = data
    // We can't validate the fields here because the file must be read first
  } catch (_error) {
    reply.code(400).send({
      success: false,
      message: 'Invalid file data',
    })
  }
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
    { preValidation: preValidateGrade },
    async (req, reply) => {

      try {
        const data = req.fileData

        logger.debug('Received file for grading')
        const uploadedFile = await writeFileToDisk(data)
        logger.debug('File saved to disk:'+ uploadedFile)

        // This MUST be after reading the file
        if(!checkFields(req, reply, data.fields)) return
        const work_id = data.fields.work_id.value
        const assignment_id = data.fields.assignment_id.value
        const callback = data.fields.callback.value

        logger.debug(`Job data: work_id=${work_id}, assignment_id=${assignment_id}, callback=${callback}`)

        // TODO: need a list of exercises / images
        // At the moment we use assignment_id, but this is a security risk
        // const containerImage = image('correction-test-1')
        const containerImage = image(assignment_id)
        logger.debug('Container image for grading:'+ containerImage)

        // Put the mensage in the queue
        const message = {
          work_id,
          image: containerImage,
          file: uploadedFile,
          callback
        }

        logger.debug('Enqueuing work for grading:'+ JSON.stringify(message))
        await putInPendingQueue(message)
        logger.info('Work enqueued for grading:'+ JSON.stringify(message))

        return {
          success: true,
          message: 'Work enqueued for grading'
        }
      }catch(e) {
        logger.error('Error grading work:'+ JSON.stringify(e.message))
        return {
          success: false,
          message: 'Error grading work'
        }
      }
    }
  )
}

export default routes




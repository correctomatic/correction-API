const env = require('../config/env')
const logger = require('../logger')
// TO-DO: Schemas are not working for multipart forms
// const { GRADE_SCHEMA } = require('../schemas/grade_schemas')

const authenticate = require('../middleware/authenticate')

const { ensureDirectoryExists, writeSubmissionToDisk } = require('../lib/utils')
const { createCorrectionJob } = require('../lib/correctomatic')
const { ParamsError, ImageError } = require('../lib/errors')

const UPLOAD_DIRECTORY = env.UPLOAD_DIRECTORY

// Module initialization
ensureDirectoryExists(UPLOAD_DIRECTORY)

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
    if (!checkFile(req, reply, data)) return
    req.fileData = data
    // We can't validate the fields here because the file must be read first
  } catch (_error) {
    reply.code(400).send({
      success: false,
      message: 'Invalid file data',
    })
  }
}

function extractParams(fields) {
  const param = fields.param
  if (!param) return []

  // When there is a single param it's a field, when there are multiple it's an array of fields
  const paramsArray = Array.isArray(param) ? param : [param]
  return paramsArray.map(param => param.value)
}

function image(name, tag) { return `${name}:${tag ?? 'latest'}` }
function splitAssignmentId(assignment_id) { return assignment_id.split('/') }

async function getImage(db, assignment_id) {
  // TO-DO: this is a security risk
  const [user, assignment] = splitAssignmentId(assignment_id)
  if(!user || !assignment) throw new ParamsError("Incorrect assignment_id format, must be 'user/assignment'")

  const assignmentInstance = await db.models.Assignment.findOne({ where: { user, assignment } })
  if (!assignmentInstance) throw new ImageError('Assignment not found')

  return image(assignmentInstance.image)
}

function userError(e) {
  return (e instanceof ParamsError) || (e instanceof ImageError)
}

async function routes(fastify, _options) {

  // This API enqueues the result

  // Expected parameters:
  // - work_id: caller's id of the exercise
  // - assignment_id: assignment id of the exercise, with format "user/assigment"
  // - file: file with the exercise
  // - callback: URL to call with the results
  // - params: list of parameters to pass to the correction script

  // Returns:
  // - success: boolean
  // - message: string ('Work enqueued for grading' or 'Error grading work')

  fastify.post(
    '/grade',
    {
      // TO-DO: this generates "body must be object" error
      // schema: GRADE_SCHEMA,
      preHandler: authenticate,
      preValidation: preValidateGrade
    },
    async (req, reply) => {

      try {
        const data = req.fileData

        logger.debug('Received file for grading')
        const uploadedFile = await writeSubmissionToDisk(UPLOAD_DIRECTORY, data)
        logger.debug('File saved to disk:' + uploadedFile)

        // This MUST be after reading the file
        if (!checkFields(req, reply, data.fields)) return
        const work_id = data.fields.work_id.value
        const assignment_id = data.fields.assignment_id.value
        const callback = data.fields.callback.value
        const params = extractParams(data.fields)

        logger.debug(`Job data: work_id=${work_id}, assignment_id=${assignment_id}, callback=${callback}, params=${JSON.stringify(params)}`)

        const image = await getImage(fastify.db, assignment_id)
        logger.debug('Container image for grading:' + image)

        await createCorrectionJob(
          work_id,
          image,
          uploadedFile,
          callback,
          params
        )

        return {
          success: true,
          message: 'Work enqueued for grading'
        }
      } catch (e) {
        logger.error('Error grading work:' + JSON.stringify(e.message))
        let message = 'Error grading work'

        // We only want to show user errors, not internal errors
        if (userError(e)) {
          message = e.message
        }

        return {
          success: false,
          message
        }
      }
    }
  )
}

module.exports = routes




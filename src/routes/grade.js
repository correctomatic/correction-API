const env = require('../config/env')
const logger = require('../logger')
// TO-DO: Schemas are not working for multipart forms
const { GRADE_SCHEMA } = require('../schemas/grade_schemas')

const authenticate = require('../middleware/authenticate')

const { ensureDirectoryExists, moveToUploadsDir } = require('../lib/utils')
const { createCorrectionJob } = require('../lib/correctomatic')
const { ParamsError, ImageError } = require('../lib/errors')
const { errorResponse } = require('../lib/requests')

const UPLOAD_DIRECTORY = env.UPLOAD_DIRECTORY

// Module initialization
ensureDirectoryExists(UPLOAD_DIRECTORY)

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
  if (!user || !assignment) throw new ParamsError("Incorrect assignment_id format, must be 'user/assignment'")

  const assignmentInstance = await db.models.Assignment.findOne({ where: { user, assignment } })
  if (!assignmentInstance) throw new ImageError('Assignment not found')

  return image(assignmentInstance.image)
}

function userError(e) {
  return (e instanceof ParamsError) || (e instanceof ImageError)
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

async function preValidateGrade(req, reply) {
  const data = req.body.file
  if (data.type !== 'file') throw new ParamsError('file field must be a file')
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
      schema: GRADE_SCHEMA,
      preHandler: authenticate,
      // preValidation: preValidateGrade
    },
    async (req, reply) => {

      try {
        if (req.body?.file?.type !== 'file') throw new ParamsError('file field must be a file')

        logger.debug('Received file for grading')
        const uploadedFile = await moveToUploadsDir(UPLOAD_DIRECTORY, req.file)
        logger.debug('File saved to disk:' + uploadedFile)

        const body = req.body
        const work_id = body.work_id?.value
        const assignment_id = body.assignment_id.value
        const callback = body.callback.value
        const params = extractParams(body)

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

        return reply.status(200).send({
          success: true,
          message: 'Work enqueued for grading'
        })

      } catch (e) {

        // We only want to show user errors, not internal errors
        if (userError(e)) {
          logger.error('User error grading work:' + JSON.stringify(e.message))
          return reply.status(400).send(errorResponse(e.message))
        }

        logger.error('Internal error grading work:' + JSON.stringify(e.message))
        return reply.status(500).send(errorResponse('Error grading work'))
      }
    }
  )
}

module.exports = routes




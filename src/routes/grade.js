const env = require('../config/env')
const logger = require('../logger')
const { GRADE_SCHEMA } = require('../schemas/grade_schemas')

const authenticator = require('../middleware/authenticator')

const { ensureDirectoryExists, moveToUploadsDir } = require('../lib/utils')
const { createCorrectionJob } = require('../lib/correctomatic')
const { ParamsError, ImageError } = require('../lib/errors')
const { errorResponse } = require('../lib/requests')

const UPLOAD_DIRECTORY = env.UPLOAD_DIRECTORY

// Module initialization
ensureDirectoryExists(UPLOAD_DIRECTORY)

function addParamValue(acc, param) {
  const [name, value] = param.value.split('=')
  if (!name || !value) throw new ParamsError(`Invalid param format: ${param}`)
  acc[name] = value
  return acc
}

function extractParams(fields) {
  const param = fields.param
  if (!param) return []

  // When there is a single param it's a field, when there are multiple it's an array of fields
  const paramsArray = Array.isArray(param) ? param : [param]
  return paramsArray.reduce(addParamValue, {})
}

function dockerImage(name, tag) { return `${name}:${tag ?? 'latest'}` }
function splitAssignmentId(assignment_id) { return assignment_id.split('/') }

async function getAssignment(db, assignment_id) {
  const [user, assignment] = splitAssignmentId(assignment_id)
  if (!user || !assignment) throw new ParamsError("Incorrect assignment_id format, must be 'user/assignment'")

  const assignmentInstance = await db.models.Assignment.findOne({ where: { user, assignment } })
  if (!assignmentInstance) throw new ImageError('Assignment not found')

  return assignmentInstance
}

function userError(e) {
  return (e instanceof ParamsError) || (e instanceof ImageError)
}

function checkFileReceived(request) {
  if (request.body?.file?.type !== 'file') throw new ParamsError('file field must be a file')
}

function filterUserParams(allowed, params) {
  const filteredParams = {};

  for (const key in params) {
    if (allowed.includes(key)) {
      filteredParams[key] = params[key];
    }
  }

  return filteredParams;
}

async function routes(fastify, _options) {

  // This API enqueues the result

  // Expected parameters:
  // - work_id: caller's id of the exercise
  // - assignment_id: assignment id of the exercise, with format "user/assignment"
  // - file: file with the exercise
  // - callback: URL to call with the results
  // - params: list of parameters to pass to the correction script

  // Returns:
  // - success: boolean
  // - message: string ('Work enqueued for grading' or 'Error grading work')

  fastify.addHook('preHandler', authenticator())

  fastify.post(
    '/grade',
    {
      schema: GRADE_SCHEMA
    },
    async (req, reply) => {

      try {
        checkFileReceived(req)

        logger.debug('Received file for grading')
        const uploadedFile = await moveToUploadsDir(UPLOAD_DIRECTORY, req.file)
        logger.debug('File saved to disk:' + uploadedFile)

        const body = req.body
        const work_id = body.work_id?.value
        const assignment_id = body.assignment_id.value
        const callback = body.callback.value
        const assignment = await getAssignment(fastify.db, assignment_id)
        const userParams = extractParams(body)

        logger.debug(`Job data: work_id=${work_id}, assignment_id=${assignment_id}, callback=${callback}, params=${JSON.stringify(userParams)}`)

        const image = dockerImage(assignment.image)
        const assignmentParams = assignment.params
        const filteredUserParams = filterUserParams(assignment.allowed_user_params, userParams)
        const params = { ...assignmentParams, ...filteredUserParams }

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




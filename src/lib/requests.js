const DEFAULT_REQUEST_LIMIT = 10
const MAX_REQUEST_LIMIT = 50

function validateQueryParams(schema) {

  return async function (request, reply) {

    const allowedParams = Object.keys(schema.querystring?.properties || {})
    const queryParams = Object.keys(request.query)

    // Check for any unexpected query parameters
    const extraParams = queryParams.filter(param => !allowedParams.includes(param))
    if (extraParams.length > 0) {
      reply.status(400).send({
        success: false,
        message: `Invalid query parameter(s): ${extraParams.join(', ')}`
      })
      return
    }
  }
}

function errorResponse(message) {
  return { success: false, message }
}

async function setLimitAndOffset(request, _reply) {
  let { limit, offset = 0 } = request.query
  request.limit = Math.min(parseInt(limit) || DEFAULT_REQUEST_LIMIT, MAX_REQUEST_LIMIT)
  request.offset = parseInt(offset) || 0
}

module.exports = {
  validateQueryParams,
  errorResponse,
  setLimitAndOffset
}

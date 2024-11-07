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

module.exports = {
  validateQueryParams,
  errorResponse
}

const ERROR_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { "enum": [ false ] },
    message: { type: 'string' }
  }
}

module.exports = ERROR_RESPONSE_SCHEMA

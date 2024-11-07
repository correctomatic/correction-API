const ERROR_RESPONSE_SCHEMA = require('./error_response_schema')

const GRADE_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    work_id: { type: 'string' },
    assignment_id: { type: 'string' },
    callback: { type: 'string' },
    file: { type: 'object', format: 'binary' },
    params: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['assignment_id', 'callback', 'file'],
  additionalProperties: false
}

const GRADE_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['sucess', 'message'],
  properties: {
    sucess: { "enum": [ true ] },
    message: { type: 'string' },
  }
}

const GRADE_SCHEMA = {
  summary: "Correction request",
  description: "\
  Sends a file for correction.\
  ",
  consumes: ['multipart/form-data'],
  body: GRADE_REQUEST_SCHEMA,
  response: {
    200: {
      description: "Successful correction request",
      ...GRADE_RESPONSE_SCHEMA
    },
    400: {
      description: "Invalid request",
      ...ERROR_RESPONSE_SCHEMA
    },
    500: {
      description: "Internal server error",
      ...ERROR_RESPONSE_SCHEMA
    }
  }
}

export {
  GRADE_SCHEMA,
}

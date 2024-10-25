
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

const GRADE_ERROR_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { "enum": [ false ] },
    message: { type: 'string' },
  }
}

const GRADE_RESPONSE = {
  200: GRADE_RESPONSE_SCHEMA,
  400: GRADE_ERROR_RESPONSE_SCHEMA,
  500: GRADE_ERROR_RESPONSE_SCHEMA,
}

const GRADE_SCHEMA = {
  summary: "Correction request",
  description: "\
  Sends a file for correction.\
  ",
  consumes: ['multipart/form-data'],
  body: GRADE_REQUEST_SCHEMA,
  response: GRADE_RESPONSE
}

export {
  GRADE_SCHEMA,
}

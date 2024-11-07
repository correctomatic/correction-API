const ERROR_RESPONSE_SCHEMA = require('./error_response_schema')

// See this: https://github.com/fastify/help/issues/525#issuecomment-932043189
const GRADE_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    work_id: {
      type: 'object',
      properties: {
        value: { type: 'string' }
      },
      description: 'String. Caller\'s id of the exercise'
    },
    assignment_id: {
      type: 'object',
      properties: {
        value: { type: 'string' }
      },
      description: 'String. Assignment id of the exercise, with the format `user/image`'
    },
    callback: {
      type: 'object',
      properties: {
        value: { type: 'string', format: 'uri' }
      },
      additionalProperties: true,
      description: 'String. URL to call with the results'
    },
    file: { format: 'binary', description: 'File to be graded' },
    param: {
      type: 'array',
      items: {
        type: 'object',
        properties: { value: { type: 'string' } },
      },
      description: 'You can include as many fields named `param` with the params ' +
        'that will be passed to the container as environment variables. ' +
        'The content of each field must have the format `ENV_VAR_NAME=VALUE`, ' +
        'being `ENV_VAR_NAME` a valid environment variable name and `VALUE` ' +
        'the value to assign to it.'
    }
  },
  required: ['assignment_id', 'callback', 'file'],
  additionalProperties: false
}

const GRADE_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { "enum": [true] },
    message: { type: 'string' },
  }
}

const GRADE_SCHEMA = {
  tags: ["Grading Operations"],
  summary: "Starts a correction",
  description: "\
  Sends a file for correction. The request must be multipart/form-data, you won't be able to test it using Swagger \
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
  },

}

module.exports = {
  GRADE_SCHEMA,
}

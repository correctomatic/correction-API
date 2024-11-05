// src/schemas/assignmentSchemas.js
const CREATE_ASSIGNMENT_SCHEMA = {
  body: {
    type: 'object',
    properties: {
      assignment: { type: 'string' },
      image: { type: 'string', format: 'uri' },
      params: { type: 'object' },
      user_params: { type: 'array', items: { type: 'string' } }
    },
    required: ['assignment', 'image'],
    additionalProperties: false
  }
}

const UPDATE_ASSIGNMENT_SCHEMA = {
  body: {
    type: 'object',
    properties: {
      image: { type: 'string', format: 'uri' },
      params: { type: 'object' },
      user_params: { type: 'array', items: { type: 'string' } }
    },
    additionalProperties: false
  }
}

const DELETE_ASSIGNMENT_SCHEMA = {
  params: {
    type: 'object',
    properties: {
      assignmentId: { type: 'string' }
    },
    required: ['assignmentId'],
    additionalProperties: false
  }
}

module.exports = {
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_ASSIGNMENT_SCHEMA,
  DELETE_ASSIGNMENT_SCHEMA
}

// src/schemas/assignmentSchemas.js
const CREATE_ASSIGNMENT_REQUEST_SCHEMA = {
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

const UPDATE_ASSIGNMENT_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    image: { type: 'string', format: 'uri' },
    params: { type: 'object' },
    user_params: { type: 'array', items: { type: 'string' } }
  },
  additionalProperties: false
}

const DELETE_ASSIGNMENT_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    assignmentId: { type: 'string' }
  },
  required: ['assignmentId'],
  additionalProperties: false
}

// Define response schemas if needed
const SUCCESS_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { "enum": [true] },
    message: { type: 'string' }
  }
}

const ERROR_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { "enum": [false] },
    message: { type: 'string' }
  }
}

const CREATE_ASSIGNMENT_SCHEMA = {
  summary: "Create Assignment",
  body: CREATE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    200: SUCCESS_RESPONSE_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}

const UPDATE_ASSIGNMENT_SCHEMA = {
  summary: "Update Assignment",
  body: UPDATE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    200: SUCCESS_RESPONSE_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}

const DELETE_ASSIGNMENT_SCHEMA = {
  summary: "Delete Assignment",
  params: DELETE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    200: SUCCESS_RESPONSE_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}

module.exports = {
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_ASSIGNMENT_SCHEMA,
  DELETE_ASSIGNMENT_SCHEMA
}

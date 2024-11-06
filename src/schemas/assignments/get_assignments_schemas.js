const ASSIGNMENT_SCHEMA = {
  type: 'object',
  properties: {
    user: { type: 'string' },
    assignment: { type: 'string' },
    params: { type: 'object' },
    user_params: { type: 'array', items: { type: 'string' } }
  },
  required: ['user', 'assignment']  // include required assignment fields
}

const ERROR_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { "enum": [ false ] },
    message: { type: 'string' }
  }
}

const GET_ASSIGNMENT_SCHEMA = {
  summary: "Get a specific assignment",
  description: "Retrieves details for a single assignment.",
  response: {
    200: ASSIGNMENT_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}

const GET_ASSIGNMENTS_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    limit: { type: 'integer', minimum: 1 },
    offset: { type: 'integer', minimum: 0 }
  },
  // This is  true so that we can throw an error if any unexpected query parameters are passed
  // if not, the query parameters will be ignored
  additionalProperties: true
}


const GET_ASSIGNMENTS_RESPONSE_SCHEMA = {
  type: 'array',
  items: ASSIGNMENT_SCHEMA
}

const GET_ASSIGNMENTS_SCHEMA = {
  summary: "Get Assignments for all users",
  description: "Retrieves a list of assignments with optional pagination.",
  querystring: GET_ASSIGNMENTS_REQUEST_SCHEMA,
  response: {
    200: GET_ASSIGNMENTS_RESPONSE_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}


module.exports = {
  GET_ASSIGNMENT_SCHEMA,
  GET_ASSIGNMENTS_SCHEMA
}

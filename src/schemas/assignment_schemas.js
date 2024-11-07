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

const CREATE_ASSIGNMENT_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    assignment: { type: 'string' },
    image: { type: 'string' },
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

// Define response schemas if needed
const MODIFICATION_SUCCESS_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { "enum": [true] },
    assignment: ASSIGNMENT_SCHEMA
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

const CREATE_ASSIGNMENT_SCHEMA = {
  summary: "Create Assignment",
  body: CREATE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    201: MODIFICATION_SUCCESS_RESPONSE_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}

const UPDATE_ASSIGNMENT_SCHEMA = {
  summary: "Update Assignment",
  body: UPDATE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    200: MODIFICATION_SUCCESS_RESPONSE_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}

const DELETE_ASSIGNMENT_SCHEMA = {
  summary: "Delete Assignment",
  // params: DELETE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    200: MODIFICATION_SUCCESS_RESPONSE_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}


module.exports = {
  GET_ASSIGNMENT_SCHEMA,
  GET_ASSIGNMENTS_SCHEMA,
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_ASSIGNMENT_SCHEMA,
  DELETE_ASSIGNMENT_SCHEMA
}

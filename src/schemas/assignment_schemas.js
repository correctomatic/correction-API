const ERROR_RESPONSE_SCHEMA = require('./error_response_schema')

const ASSIGNMENT_SCHEMA = {
  type: 'object',
  properties: {
    user: { type: 'string' },
    assignment: { type: 'string' },
    image: { type: 'string' },
    params: {
      type: 'object',
      additionalProperties: { type: 'string' }  // Accepts any key with a string value
    },
    allowed_user_params: { type: 'array', items: { type: 'string' } }
  },
  required: ['user', 'assignment']  // include required assignment fields
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
    allowed_user_params: { type: 'array', items: { type: 'string' } }
  },
  required: ['assignment', 'image'],
  additionalProperties: false
}

const UPDATE_ASSIGNMENT_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    image: { type: 'string' },
    params: { type: 'object' },
    allowed_user_params: { type: 'array', items: { type: 'string' } }
  },
  additionalProperties: false
}

const MODIFICATION_SUCCESS_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['success', 'assignment'],
  properties: {
    success: { "enum": [true] },
    assignment: ASSIGNMENT_SCHEMA
  }
}

const GET_ASSIGNMENT_SCHEMA = {
  tags: ["Assignments Management"],
  summary: "Get a specific assignment",
  description: "Retrieves details for a single assignment.",
  security: [{ bearerAuth: [] }],
  response: {
    200: ASSIGNMENT_SCHEMA,
    400: ERROR_RESPONSE_SCHEMA,
    500: ERROR_RESPONSE_SCHEMA
  }
}

const GET_ASSIGNMENTS_SCHEMA = {
  tags: ["Assignments Management"],
  summary: "Get Assignments",
  description: "Retrieves a list of assignments with optional pagination.",
  querystring: GET_ASSIGNMENTS_REQUEST_SCHEMA,
  response: {
    200: {
      description: 'Successfully retrieved the list of assignments.',
      ...GET_ASSIGNMENTS_RESPONSE_SCHEMA
    },
    400: {
      description: 'Bad request, invalid query parameters or missing required fields.',
      ...ERROR_RESPONSE_SCHEMA
    },
    500: {
      description: 'Internal server error, something went wrong on the server.',
      ...ERROR_RESPONSE_SCHEMA
    }
  }
}

const CREATE_ASSIGNMENT_SCHEMA = {
  tags: ["Assignments Management"],
  summary: "Create Assignment",
  description: "Creates a new assignment for the current user.",
  body: CREATE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    201: {
      description: 'Successfully created the assignment.',
      ...MODIFICATION_SUCCESS_RESPONSE_SCHEMA
    },
    400: {
      description: 'Bad request, invalid input data or missing required fields.',
      ...ERROR_RESPONSE_SCHEMA
    },
    500: {
      description: 'Internal server error, something went wrong on the server.',
      ...ERROR_RESPONSE_SCHEMA
    }
  }
}

const UPDATE_ASSIGNMENT_BASE_SCHEMA = {
  tags: ["Assignments Management"],
  body: UPDATE_ASSIGNMENT_REQUEST_SCHEMA,
  response: {
    200: {
      description: 'Successfully updated the assignment.',
      ...MODIFICATION_SUCCESS_RESPONSE_SCHEMA
    },
    400: {
      description: 'Bad request, invalid input data or missing required fields.',
      ...ERROR_RESPONSE_SCHEMA
    },
    500: {
      description: 'Internal server error, something went wrong on the server.',
      ...ERROR_RESPONSE_SCHEMA
    }
  }
}

const UPDATE_OWN_ASSIGNMENT_SCHEMA = {
  summary: "Update own Assignment",
  description: "Update an assignment for the current user.",
  ...UPDATE_ASSIGNMENT_BASE_SCHEMA,
}

const UPDATE_FOREIGN_ASSIGNMENT_SCHEMA = {
  summary: "Update another's user Assignment",
  description: "Update an assignment for a different user (admin only).",
  ...UPDATE_ASSIGNMENT_BASE_SCHEMA,
}


const DELETE_ASSIGNMENT_BASE_SCHEMA = {
  tags: ["Assignments Management"],
  response: {
    204: {
      description: 'Successfully deleted the assignment.',
      type: 'null',
    },
    400: {
      description: 'Bad request, invalid input data or assignment not found.',
      ...ERROR_RESPONSE_SCHEMA
    },
    500: {
      description: 'Internal server error, something went wrong on the server.',
      ...ERROR_RESPONSE_SCHEMA
    }
  }
}

const DELETE_OWN_ASSIGNMENT_SCHEMA = {
  summary: "Delete own Assignment",
  description: "Delete an assignment for the current user.",
  ...DELETE_ASSIGNMENT_BASE_SCHEMA,
}

const DELETE_FOREIGN_ASSIGNMENT_SCHEMA = {
  summary: "Delete another's user Assignment",
  description: "Delete an assignment for a different user (admin only).",
  ...DELETE_ASSIGNMENT_BASE_SCHEMA,
}


module.exports = {
  GET_ASSIGNMENT_SCHEMA,
  GET_ASSIGNMENTS_SCHEMA,
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_OWN_ASSIGNMENT_SCHEMA,
  UPDATE_FOREIGN_ASSIGNMENT_SCHEMA,
  DELETE_OWN_ASSIGNMENT_SCHEMA,
  DELETE_FOREIGN_ASSIGNMENT_SCHEMA
}

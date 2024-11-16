const ERROR_RESPONSE_SCHEMA = require('./error_response_schema')

const CREATE_API_KEY_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    success: { "enum": [true] },
    key: { type: 'string', description: 'Generated API key' }
  },
  required: ['key']
}

const LIST_API_KEYS_RESPONSE_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      key: { type: 'string', description: 'Generated API key' },
      createdAt: { type: 'string', format: 'date-time', description: 'Creation date of the key' }
    },
    required: ['key', 'user', 'createdAt']
  }
}

const CREATE_API_KEY_SCHEMA = {
  tags: ["API Key Management"],
  summary: "Create Api Key",
  description: "Creates a new API key for the current user.",
  security: [{ bearerAuth: [] }],
  // body: CREATE_API_KEY_RESPONSE_SCHEMA,
  response: {
    200: {
      description: 'Successfully created the API key.',
      ...CREATE_API_KEY_RESPONSE_SCHEMA
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

const LIST_API_KEYS_SCHEMA = {
  tags: ["API Key Management"],
  summary: "List Api Keys",
  description: "Lists all the API keys for the current user.",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: 'Successfully retrieved the list of API keys.',
      ...LIST_API_KEYS_RESPONSE_SCHEMA
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

const DELETE_API_KEY_SCHEMA = {
  tags: ["API Key Management"],
  summary: "Remove an Api Key",
  description: "Removes the specified API key.",
  security: [{ bearerAuth: [] }],
  response: {
    204: {
      description: 'Successfully deleted the assignment.',
      type: 'null',
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

module.exports = {
  CREATE_API_KEY_SCHEMA,
  LIST_API_KEYS_SCHEMA,
  DELETE_API_KEY_SCHEMA
}

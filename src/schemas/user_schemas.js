import ERROR_RESPONSE_SCHEMA from './error_response_schema.js'

const GET_USERS_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    limit: { type: 'integer', minimum: 1 },
    offset: { type: 'integer', minimum: 0 }
  },
  // This is  true so that we can throw an error if any unexpected query parameters are passed
  // if not, the query parameters will be ignored
  additionalProperties: true
}

const GET_USERS_RESPONSE = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      roles: { type: 'array', items: { type: 'string' } }
    }
  }
}

const GET_USERS_SCHEMA = {
  tags: ["Users Management"],
  summary: "Get all users (admin only)",
  description: "Get all users. Only works for Admins. Admits pagination.",
  querystring: GET_USERS_REQUEST_SCHEMA,
  response: {
    200: {
      description: 'Successfully fetched the users.',
      ...GET_USERS_RESPONSE
    },
    500: {
      description: 'Internal server error, something went wrong on the server.',
      ...ERROR_RESPONSE_SCHEMA
    }
  }
}

const CREATE_USER_REQUEST = {
  type: 'object',
  properties: {
    user: { type: 'string' },
    password: { type: 'string' },
    roles: { type: 'array', items: { type: 'string' } }
  },
  required: ['user', 'password'],
  additionalProperties: false
}

const CREATE_USER_RESPONSE = {
  type: 'object',
  properties: {
    user: { type: 'string' },
    roles: { type: 'array', items: { type: 'string' } }
  },
  required: ['user', 'roles'],
  additionalProperties: false
}

const CREATE_USER_SCHEMA = {
  tags: ["Users Management"],
  summary: "Create a new user (admin only)",
  description: "Create a new user. Only works for Admins.",
  body: CREATE_USER_REQUEST,
  response: {
    201: CREATE_USER_RESPONSE,
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

const SET_PASSWORD_BASE_SCHEMA = {
  tags: ["Users Management"],
  body: {
    type: 'object',
    properties: {
      password: { type: 'string' }
    },
    required: ['password'],
    additionalProperties: false
  },
  response: {
    204: {
      description: 'Successfully updated the password.',
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

const UPDATE_OWN_PASSWORD_SCHEMA = {
  summary: "Update own password",
  description: "Update the password for the current user.",
  ...SET_PASSWORD_BASE_SCHEMA,
}

const UPDATE_FOREIGN_PASSWORR_SCHEMA = {
  summary: "Update another's user password (admin only)",
  description: "Update the password for a different user (admin only).",
  ...SET_PASSWORD_BASE_SCHEMA,
}


export {
  GET_USERS_SCHEMA,
  CREATE_USER_SCHEMA,
  UPDATE_OWN_PASSWORD_SCHEMA,
  UPDATE_FOREIGN_PASSWORR_SCHEMA,
}

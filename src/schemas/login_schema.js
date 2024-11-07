const ERROR_RESPONSE_SCHEMA = require('./error_response_schema')

const LOGIN_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    user: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 1 }
  },
  required: ['user', 'password'],
  errorMessage: {
    required: {
      user: 'User is required',
      password: 'Password is required'
    },
    properties: {
      user: 'User cannot be empty',
      password: 'Password cannot be empty'
    }
  }
}

const LOGIN_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    token: { type: 'string' }
  }
}

const LOGIN_SCHEMA = {
  tags: ["Users Management"],
  summary: "User login",
  description: "\
  User sign in. The API will return a JWT bearer token that must be sent in subsequent requests\
  ",
  body: LOGIN_REQUEST_SCHEMA,
  response: {
    200: {
      description: 'Successfully authenticated, returns a JWT bearer token.',
      ...LOGIN_RESPONSE_SCHEMA
    },
    400: {
      description: 'Bad request, invalid input data.',
      ...ERROR_RESPONSE_SCHEMA
    },
    401: {
      description: 'Unauthorized, invalid credentials provided.',
      ...ERROR_RESPONSE_SCHEMA
    }
  }
}

module.exports = {
  LOGIN_SCHEMA
}

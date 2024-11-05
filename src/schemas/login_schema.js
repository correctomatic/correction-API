const LOGIN_SCHEMA = {
  body: {
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
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    },
    401: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
}

module.exports = {
  LOGIN_SCHEMA
}

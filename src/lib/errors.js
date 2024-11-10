class ParamsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParamsError'
  }
}

class ImageError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParamsError'
  }
}

function sequelizeError(error) {
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(e => `Field '${e.path}': ${e.message}`).join(', ')
    return (`Validation error(s): ${messages}`)
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return ('Duplicated assignment')
  }

  return null
}

module.exports = {
  ParamsError,
  ImageError,
  sequelizeError
}

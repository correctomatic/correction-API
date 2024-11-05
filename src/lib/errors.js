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

module.exports = {
  ParamsError,
  ImageError
}

const httpStatus = require('http-status')

/**
 * 
 * 
 * @class ExtendableError
 * @extends {Error}
 */
class ExtendableError extends Error {
  constructor(message, status, isPublic) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.status = status
    this.isPublic = isPublic
    this.isOperational = true // this is required since bluebird4 dose not append it anymore
    Error.captureStackTrace(this, this.constructor.name)
  } 
}


/**
 * class representing an API Error
 * 
 * @class APIError
 * @extends {ExtendableError}
 */
class APIError extends ExtendableError {


  /**
   * Creates an instance of APIError.
   * @param {any} message  -  error message
   * @param {any} [status] - http status code of error
   * @param {boolean} [isPublic=false] - whether the message should be is visible to user or not
   * 
   * @memberOf APIError
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message, status, isPublic)
  }

}

module.exports = APIError
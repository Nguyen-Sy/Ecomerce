'use strict'

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")

class ErrorRespone extends Error {

    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorRespone {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode)
    }
}


class BadRequestError extends ErrorRespone {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorRespone {
    constructor(message = ReasonPhrases.AuthFailureError, statusCode = StatusCodes.AuthFailureError) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorRespone {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError
}
'use strict'

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode")


class SuccessRespone {

    constructor({ message, status = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} }, options = null) {
        this.message = !message ? reasonStatusCode : message;
        this.status = status;
        this.metadata = metadata
        this.options = options
    }

    send(res) {
        res.status(this.status).json(this)
    }
}

class OKResponse extends SuccessRespone {
    constructor({ message, metadata }, options) {
        super({ message, metadata }, options)
    }
}

class CreatedResponse extends SuccessRespone {
    constructor({ message, status = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata }, options) {
        super({ message, status, reasonStatusCode, metadata }, options)
    }
}

module.exports = {
    OKResponse,
    CreatedResponse,
    SuccessRespone
}
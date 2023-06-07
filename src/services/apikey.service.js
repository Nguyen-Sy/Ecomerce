'use strict';

const apikeyModel = require("../models/apikey.model");

const findById = async (key) => {

    const objecKey = await apikeyModel.findOne({ key, status: true }).lean()

    return objecKey
}

module.exports = {
    findById
}
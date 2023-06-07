'use strict';
const crypto = require("crypto")
const apikeyModel = require("../models/apikey.model");

const findApiKeyByKey = async (key) => {
    return await apikeyModel.findOne({ key, status: true }).lean()
}

const createApiKey = async () => {
    return await apikeyModel.create({
        key: crypto.randomBytes(64).toString('hex'),
        permissions: '0000'
    })
}

module.exports = {
    findApiKeyByKey
}
"use strict";

const _ = require('lodash')
const crypto = require('crypto')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const createPublicAndPrivateKey = () => {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
    })
}

module.exports = {
    getInfoData,
    createPublicAndPrivateKey
}
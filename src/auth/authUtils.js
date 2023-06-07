'use strict';
const jwt = require('jsonwebtoken');
const { asyncHanlder } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.respone');
const { findKeyTokenByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accesToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        jwt.verify(accesToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify', err)
            } else {
                console.log('decode verrify::', decode)
            }
        })
        return {
            accesToken,
            refreshToken
        }
    } catch (err) {
        console.log(err)
    }
}

const authentication = asyncHanlder(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid request")

    const keyStore = await findKeyTokenByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore")

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError("Invalid request")
    console.log(`KeyStore::`, keyStore)
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw AuthFailureError("Invalid userId")
        req.keyStore = keyStore
        return next()
    } catch (error) {
        console.log(`Authenticate Error::`, error.message)
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}
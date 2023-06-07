'use strict';
const jwt = require('jsonwebtoken');
const { asyncHanlder } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.respone');
const { findKeyTokenByUserId } = require('../services/keyToken.service');
const { fullUrl } = require('../utils');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const authentication = asyncHanlder(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid request")

    const keyStore = await findKeyTokenByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore")

    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if (!refreshToken) throw new AuthFailureError("Invalid request")

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError("Invalid request")
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw AuthFailureError("Invalid userId")

        req.keyStore = keyStore
        req.user = decodeUser
        req.refreshToken = refreshToken
        return next()
    } catch (error) {
        const URL = fullUrl(req).toString()
        if (URL.includes("handleRefreshToken")) {
            const decodeUser = jwt.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw AuthFailureError("Invalid userId")

            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        }
        throw error
    }
})

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


const verifyJWT = async (refreshToken, secretKey) => {
    return await jwt.verify(refreshToken, secretKey)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}
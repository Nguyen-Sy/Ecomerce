'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        console.log(publicKey)
        try {
            const publicKeyString = publicKey.toString()
            console.log(publicKeyString)
            const token = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })

            return token ? token.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService
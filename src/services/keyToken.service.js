'use strict';

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const publicKeyString = publicKey.toString()
            const privateKeyString = privateKey.toString()

            const filter = { user: userId }, update = {
                publicKey: publicKeyString,
                privateKey: privateKeyString,
                refreshTokensUsed: [],
                refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findKeyTokenByUserId = async (userId) => {
        const keyToken = await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
        return keyToken
    }

    static removeKeyTokenById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id })
    }
}

module.exports = KeyTokenService
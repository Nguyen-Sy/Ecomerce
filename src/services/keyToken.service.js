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
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static findKeyTokenByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }

    static findKeyTokenByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static removeKeyTokenById = async (id) => {
        return await keytokenModel.findOneAndDelete({ _id: id })
    }

    static removeKeyTokenByUserId = async (userId) => {
        return await keytokenModel.findOneAndDelete({ user: userId })
    }

}

module.exports = KeyTokenService
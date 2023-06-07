'use strict';

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const ROLES = {
    SHOP: '001',
    WRITTER: "002",
    EDITOR: "003",
    ADMIN: "004"
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {

            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: "Shop already exists"
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                email, password: passwordHash, name, roles: [ROLES.SHOP]
            })

            if (newShop) {
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
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

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                //create token pair
                const tokens = await createTokenPair({ userId: newShop._id }, publicKeyObject, privateKey)
                console.log(tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }
            return {
                code: 201,
                metadata: {
                    shop: newShop,
                    tokens
                }
            }


        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;
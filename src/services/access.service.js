"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData, createPublicAndPrivateKey } = require("../utils");
const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
} = require("../core/error.respone");
const { findShopByEmail } = require("./shop.service");
const { sendOtpSignup } = require("./otp.service");

const ROLES = {
    SHOP: "001",
    WRITTER: "002",
    EDITOR: "003",
    ADMIN: "004",
};

class AccessService {
    // cost 6.68s to process
    static signUp = async ({ name, email, password }) => {
        const holderShop = await findShopByEmail({ email });
        if (holderShop) {
            throw new BadRequestError("Error:: Shop already exist");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            email,
            password: passwordHash,
            name,
            roles: [ROLES.SHOP],
        });

        if (newShop) {
            const { privateKey, publicKey } = createPublicAndPrivateKey();
            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            });
            if (!publicKeyString) {
                return {
                    code: "xxxx",
                    message: "publicKeyString error",
                };
            }

            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );
            await sendOtpSignup(newShop);
            return {
                shop: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: newShop,
                }),
                tokens,
            };
        }
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: newShop,
            }),
            tokens,
        };
    };

    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findShopByEmail({ email });
        if (!foundShop) throw new BadRequestError("Shop not registed");
        if (!foundShop.verify)
            throw new BadRequestError("Shop account is not verify");

        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError("Authentication Error");

        const { privateKey, publicKey } = createPublicAndPrivateKey();

        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyTokenById(keyStore._id);
        return delKey;
    };

    static handleRefreshToken = async ({ user, refreshToken, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyTokenByUserId(userId);
            throw new ForbiddenError(
                "Something wrong happended!! Please relogin"
            );
        }

        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError("Token invalid");

        const foundShop = await findShopByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop is not registed");

        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user,
            tokens,
        };
    };
}

module.exports = AccessService;

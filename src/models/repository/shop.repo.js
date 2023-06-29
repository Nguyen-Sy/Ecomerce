"use strict";

const { castStringToObjectIdMongoose } = require("../../utils");
const shopModel = require("../shop.model");

const findShopByEmail = async ({
    email,
    select = {
        email: 1,
        password: 2,
        name: 1,
        status: 1,
        roles: 1,
    },
}) => {
    return await shopModel.findOne({ email }).select(select).lean();
};

const findShopById = async ({
    userId,
    select = {
        email: 1,
        password: 2,
        name: 1,
        status: 1,
        roles: 1,
    },
}) => {
    return await shopModel.findById(userId).select(select).lean();
};

const verifyUser = async (userId) => {
    return await shopModel
        .findByIdAndUpdate(
            userId,
            {
                verify: true,
            },
            {
                new: true,
            }
        )
        .select({ email: 1, name: 1, status: 1, verify: 1 });
};

module.exports = {
    findShopByEmail,
    findShopById,
    verifyUser,
};

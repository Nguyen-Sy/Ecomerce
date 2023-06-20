"use strict";

const { castStringToObjectIdMongoose } = require("../../utils");
const { cart } = require("../cart.model");

const findCartById = async (cartId) => {
    return await cart
        .findOne({
            _id: castStringToObjectIdMongoose(cartId),
            cart_state: "active",
        })
        .lean();
};

module.exports = {
    findCartById,
};

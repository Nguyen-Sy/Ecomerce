"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "completed", "failed", "pending"],
            default: "active",
        },
        cart_products: {
            type: Array,
            required: true,
            default: [],
        },
        cart_count_product: Number,
        cart_userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        // [{productId, shopId, quantity, name, price}]
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema),
};

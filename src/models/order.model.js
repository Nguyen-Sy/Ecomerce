"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
    {
        order_userId: { type: Schema.Types.ObjectId, required: true },
        order_checkout: {
            type: Object,
            default: {},
        },
        /* 
            ordercheckout: {
                totalPrice,
                totalApplyDiscount,
                feeShip
            }
        */
        order_shipping: {
            type: Object,
            default: {},
        },
        order_payment: {
            type: Object,
            default: {},
        },
        order_products: {
            type: Array,
            required: true,
        },
        order_trackingNumber: {
            type: String,
        },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "canceled", "delivered"],
            default: "pending",
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema),
};

"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
        discount_max_use: { type: Number, require: true },
        discount_type: {
            type: String,
            enum: ["fix_amount", "percentage"],
            default: "fix_amount",
        },
        discount_value: { type: Number, required: true },
        discount_code: { type: String, required: true },
        discount_start_day: { type: Date, required: true },
        discount_end_day: { type: Date, required: true },
        discount_used_count: { type: Number, required: true },
        discount_used_users: { type: Array, default: [] },
        discount_max_use_per_user: { type: Number, required: true },
        discount_min_order_value: { type: Number, require: true },
        discount_is_active: { type: Boolean, default: false },
        discount_apply_to: {
            type: String,
            enum: ["delivery", "product-all", "product-specific"],
            required: true,
        },
        discount_product_ids: { type: Array, default: [] },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);

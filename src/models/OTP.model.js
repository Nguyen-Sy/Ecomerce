"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "OTP";
const COLLECTION_NAME = "OTPs";

const otpSchema = new Schema(
    {
        otp_userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        otp_code: {
            type: String,
            required: true,
        },
        otp_type: {
            type: String,
            enum: ["verify", "forgot-password"],
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = {
    OTP: model(DOCUMENT_NAME, otpSchema),
};

"use strict";
const { createOTP } = require("../models/repository/OTP.repo");
const {
    sendOTPEmail,
    sendForgotPasswordEmail,
    sendReceiptEmail,
} = require("./nodemailer.service");
const { findShopById } = require("../models/repository/shop.repo");

class OtpService {
    static sendOtpSignup = async (user) => {
        const { _id: userId } = user;
        const code = Math.round(Math.random() * 10000 + 10000).toString();
        const createdOTP = await createOTP({ code, userId, type: "verify" });
        if (createdOTP) {
            await sendOTPEmail({ OTP: code, receiver: user });
        }
        return createdOTP;
    };

    static sendOtpForgotPassword = async (user) => {
        const { _id: userId } = user;
        const code = Math.round(Math.random() * 10000 + 10000);
        const createdOTP = await createOTP({ code, userId, type: "verify" });
        if (createdOTP) {
            await sendForgotPasswordEmail({ OTP: code, receiver: user });
        }
        return createdOTP;
    };

    static sendReceipt = async ({ userId, order }) => {
        const user = await findShopById(userId);
        await sendReceiptEmail({ order, user });
    };
}

module.exports = OtpService;

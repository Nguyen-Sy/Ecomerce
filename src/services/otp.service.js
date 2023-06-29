"use strict";
const { BadRequestError } = require("../core/error.respone");
const { OTP } = require("../models/OTP.model");
const { createOTP } = require("../models/repository/OTP.repo");
const { verifyUser } = require("../models/repository/shop.repo");
const bcrypt = require("bcrypt");
const {
    sendOTPEmail,
    sendForgotPasswordEmail,
} = require("./nodemailer.service");

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

    static verifyOtp = async (query) => {
        // query: "OTP|userId|type"
        // type: enum["verify","forgot password"]

        const text = Buffer.from(query, "base64").toString("utf-8");
        const params = text.split("|");

        const foundOtp = await OTP.findOne({
            otp_userId: params[1],
            otp_type: params[2],
        });

        const isMatch = bcrypt.compare(foundOtp.otp_code, params[0]);
        if (!isMatch) throw new BadRequestError("Invalid otp");

        const deletedOtp = await OTP.findByIdAndDelete(foundOtp._id);
        console.log(deletedOtp);
        if (deletedOtp.deletedCount === 0)
            throw new BadRequestError("Invalid OTP");

        return await verifyUser(params[1]);
    };
}

module.exports = OtpService;

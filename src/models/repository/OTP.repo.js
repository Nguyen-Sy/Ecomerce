const { OTP } = require("../OTP.model");
const bcrypt = require("bcrypt");

const createOTP = async ({ code, userId, type }) => {
    const hashCode = await bcrypt.hash(code, 10);
    return await OTP.create({
        otp_code: hashCode,
        otp_userId: userId,
        otp_type: type,
    });
};

module.exports = {
    createOTP,
};

const { CreatedResponse, SuccessRespone } = require("../core/success.respone");
const OtpService = require("../services/otp.service");

class OtpController {
    verifyOtp = async (req, res, next) => {
        new SuccessRespone({
            message: "Verify account success",
            metadata: await OtpService.verifyOtp(req.params.verify),
        }).send(res);
    };
}

module.exports = new OtpController();

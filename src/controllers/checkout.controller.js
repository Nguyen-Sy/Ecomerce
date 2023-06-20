const { CreatedResponse, SuccessRespone } = require("../core/success.respone");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
    reviewCheckout = async (req, res, next) => {
        new SuccessRespone({
            message: "Review checkout success",
            metadata: await CheckoutService.reviewCheckout({
                ...req.body,
            }),
        }).send(res);
    };
}

module.exports = new CheckoutController();

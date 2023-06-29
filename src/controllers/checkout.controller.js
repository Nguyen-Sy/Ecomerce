const { CreatedResponse, SuccessRespone } = require("../core/success.respone");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
    reviewCheckout = async (req, res, next) => {
        new SuccessRespone({
            message: "Review checkout success",
            metadata: await CheckoutService.reviewCheckout({
                ...req.body,
                userId: req.user.userId,
            }),
        }).send(res);
    };

    placeOrder = async (req, res, next) => {
        new SuccessRespone({
            message: "Placing order success",
            metadata: await CheckoutService.place_order({
                ...req.body,
                userId: req.user.userId,
            }),
        }).send(res);
    };

    getAllOrderByUser = async (req, res, next) => {
        new SuccessRespone({
            message: "Get all orders by user",
            matadata: await CheckoutService.getOrdersByUser(req.user.userId),
        }).send(res);
    };

    getOrderByUser = async (req, res, next) => {
        new SuccessRespone({
            message: "Get order by user",
            metadata: await CheckoutService.getOneOrderByUser({
                orderId: req.params.orderId,
                userId: req.user.userId,
            }),
        }).send(res);
    };
}

module.exports = new CheckoutController();

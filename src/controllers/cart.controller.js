const { CreatedResponse, SuccessRespone } = require("../core/success.respone");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessRespone({
            message: "Add product to cart success",
            metadata: await CartService.addToCart({
                userId: req.user.userId,
                ...req.body,
            }),
        }).send(res);
    };

    updateExistedProductQuantity = async (req, res, next) => {
        new SuccessRespone({
            message: "Update existed product quantity success",
            metadata: await CartService.updateExistedProductQuantity({
                userId: req.user.userId,
                ...req.body,
            }),
        }).send(res);
    };

    deleteProductCart = async (req, res, next) => {
        new SuccessRespone({
            message: "Delete cart success",
            metadata: await CartService.deleteProductUserCart({
                userId: req.user.userId,
                ...req.body,
            }),
        }).send(res);
    };

    listAllProductCart = async (req, res, next) => {
        new SuccessRespone({
            message: "List all product cart success",
            metadata: await CartService.getListItemUserCart({
                userId: req.user.userId,
            }),
        }).send(res);
    };
}

module.exports = new CartController();

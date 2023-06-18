const { CreatedResponse, SuccessRespone } = require("../core/success.respone");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessRespone({
            message: "Add product to cart success",
            metadata: await CartService.addToCart({
                ...req.body,
                userId: req.user.userId,
            }),
        }).send(res);
    };

    updateExistedProductQuantity = async (req, res, next) => {
        new SuccessRespone({
            message: "Update existed product quantity success",
            metadata: await CartService.updateExistedProductQuantity({
                ...req.body,
                userId: req.user.userId,
            }),
        }).send(res);
    };

    deleteProductCart = async (req, res, next) => {
        new SuccessRespone({
            message: "Delete cart success",
            metadata: await CartService.deleteProductUserCart({
                ...req.body,
                userId: req.user.userId,
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

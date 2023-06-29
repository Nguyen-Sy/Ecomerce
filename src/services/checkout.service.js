"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.respone");
const { findCartById } = require("../models/repository/cart.repo");
const { checkProductServer } = require("../models/repository/product.repo");
const { getDiscountAmout } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis/redis.service");
const { order } = require("../models/order.model");
const { deleteUserCart } = require("./cart.service");
const { castStringToObjectIdMongoose } = require("../utils");
const { sendReceiptEmail } = require("../services/nodemailer.service");
const { findShopById } = require("../models/repository/shop.repo");
class CheckoutService {
    /* 
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                item_products: [{
                    quanity,
                    productId,
                    price
                }]
                shop_discount: {
                    codeId:
                    discountId: 
                }
            }
        ]
    }
    */
    static async reviewCheckout({ cartId, userId, shop_order_ids }) {
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new NotFoundError("Cart is not exist");

        const reviewCheckoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        };
        const newShopOrderIds = [];

        const shopOrderIdsLenght = shop_order_ids.length;
        for (let i = 0; i < shopOrderIdsLenght; i++) {
            const {
                shopId,
                shop_discount,
                item_products = [],
            } = shop_order_ids[i];
            const checkedProductServer = await checkProductServer(
                item_products
            );
            if (!checkedProductServer[0])
                throw new BadRequestError("Order is wrong");

            const checkCountPrice = checkedProductServer.reduce(
                (acc, product) => acc + product.quantity * product.price,
                0
            );
            reviewCheckoutOrder.totalPrice += checkCountPrice;

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkCountPrice,
                priceApplyDiscount: checkCountPrice,
                item_products: checkedProductServer,
            };
            if (Object.keys(shop_discount).length > 0) {
                const { discount = 0, totalPrice = 0 } = await getDiscountAmout(
                    {
                        shopId,
                        code: shop_discount.code,
                        products: checkedProductServer,
                        userId,
                    }
                );

                reviewCheckoutOrder.totalDiscount += discount;

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount =
                        checkCountPrice - discount;
                }
            }
            reviewCheckoutOrder.totalCheckout +=
                itemCheckout.priceApplyDiscount;
            newShopOrderIds.push(itemCheckout);
        }
        return {
            shop_order_ids,
            newShopOrderIds,
            reviewCheckoutOrder,
        };
    }

    static async place_order({
        cartId,
        userId,
        shop_order_ids,
        user_address = {},
        user_payment = {},
    }) {
        const { newShopOrderIds, reviewCheckoutOrder } =
            await CheckoutService.reviewCheckout({
                cartId,
                userId,
                shop_order_ids,
            });

        const products = newShopOrderIds.flatMap(
            (order) => order.item_products
        );
        console.log(products);

        const acquireProducts = [];
        const productsLength = products.length;
        for (let i = 0; i < productsLength; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock({
                productId,
                quantity,
                cartId,
            });
            acquireProducts.push(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock);
            }
            console.log({ keyLock });
        }

        if (acquireProducts.includes(false)) {
            throw new BadRequestError(
                "Some products is updated, please return to your cart"
            );
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: reviewCheckoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: newShopOrderIds,
        });

        if (newOrder) {
            await deleteUserCart(userId);
            const user = await findShopById({ userId });
            await sendReceiptEmail({
                order: newOrder,
                receiver: user,
            });
        }

        return newOrder;
    }

    static async getOrdersByUser(userId) {
        return await order.findOne({
            order_userId: castStringToObjectIdMongoose(userId),
        });
    }

    static async getOneOrderByUser({ userId, orderId }) {
        const foundOrder = await order.findOne({
            _id: castStringToObjectIdMongoose(orderId),
            order_userId: userId,
        });

        if (!foundOrder) throw new BadRequestError("Invalid order");
        return foundOrder;
    }

    // is not finish
    static async cancelOrderByUser({ orderId, userId }) {
        const cancelOrder = await order.findOneAndUpdate(
            { _id: orderId },
            { cart_state: "cancel" },
            { new: true }
        );
        if (!cancelOrder) throw new BadRequestError("Cant cancel the order");

        const { order_products } = cancelOrder;
    }
}

module.exports = CheckoutService;

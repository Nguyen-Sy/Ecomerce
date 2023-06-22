"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.respone");
const { findCartById } = require("../models/repository/cart.repo");
const { checkProductServer } = require("../models/repository/product.repo");
const { getDiscountAmout } = require("./discount.service");

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

            if (shop_discount) {
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
        console.log(products)
        const productsLength = products.length
        for(let i =0; i < productsLength; i++){
            const {productId, quantity} = products[i]
        }
    }
}

module.exports = CheckoutService;

"use strict";
const { cart } = require("../models/cart.model");
const { NotFoundError } = require("../core/error.respone");
const { findProductById } = require("../models/repository/product.repo");
const { castStringToObjectIdMongoose } = require("../utils");
class CartService {
    static async createUserCart({ userId, product }) {
        const query = {
            cart_userId: userId,
            cart_state: "active",
        };
        const updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        };
        const options = { upsert: true, new: true };
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: "active",
        };
        const updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity,
            },
        };
        const options = {
            upsert: true,
            new: true,
        };

        return await cart.findOneAndUpdate(query, updateSet, options);
    }

    static async addToCart({ userId, product }) {
        const { productId } = product;
        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundError("Product is not exist ");
        const userCart = await cart
            .findOne({ cart_userId: castStringToObjectIdMongoose(userId) })
            .lean();

        if (!userCart) {
            return await this.createUserCart({
                userId,
                product: {
                    ...product,
                    name: foundProduct.product_name,
                    price: foundProduct.product_price,
                },
            });
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [
                ...userCart.cart_products,
                {
                    ...product,
                    name: foundProduct.product_name,
                    price: foundProduct.product_price,
                },
            ];
            return await userCart.save();
        }

        return this.updateQuantity({
            userId,
            product: {
                ...product,
                name: foundProduct.product_name,
                price: foundProduct.product_price,
            },
        });
    }

    static async updateExistedProductQuantity({ userId, shop_order_ids = {} }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];
        console.log(shop_order_ids[0]?.item_products);
        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundError();
        if (
            foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId
        ) {
            throw new NotFoundError("Product is not belong to this shop");
        }

        if (quantity === 0) {
            return await this.deleteProductUserCart({ userId, productId });
        }

        return await CartService.updateQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
                name: foundProduct.product_name,
                price: foundProduct.product_price,
            },
        });
    }

    static async deleteProductUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: "active" };
        const updateSet = {
            $pull: {
                cart_products: {
                    productId,
                },
            },
        };

        return await cart.updateOne(query, updateSet);
    }

    static async getListItemUserCart({ userId }) {
        return await cart
            .findOne({
                cart_userId: userId,
            })
            .lean();
    }
}

module.exports = CartService;

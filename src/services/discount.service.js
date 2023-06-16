"use strict";

const discount = require("../models/discount.model");
const {
    findDiscountByCodeAndShopId,
    findAllDiscountSelect,
    findAllDiscountUnSelect,
} = require("../models/repository/discount.repo");
const { findAllProduct } = require("../models/repository/product.repo");
const {
    castStringToObjectIdMongoose,
    removeUndefindedObject,
} = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.respone");

class DiscountService {
    static async createDiscount({
        code,
        start_date,
        end_date,
        is_active,
        shopId,
        min_order_value,
        max_use,
        product_ids,
        apply_to,
        name,
        description,
        type,
        value,
        max_use_per_user,
    }) {
        const foundDiscount = await findDiscountByCodeAndShopId({
            shopId,
            code,
        });
        if (foundDiscount) {
            throw new BadRequestError("Discount already existed!!");
        }
        //validate will be add soon
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_shopId: castStringToObjectIdMongoose(shopId),
            discount_max_use: max_use,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_day: new Date(start_date),
            discount_end_day: new Date(end_date),
            discount_used_count: 0,
            discount_used_users: [],
            discount_max_use_per_user: max_use_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_is_active: is_active,
            discount_apply_to: apply_to,
            discount_product_ids:
                apply_to === "product-specific" ? product_ids : [],
        });

        return newDiscount;
    }

    static async getAllDiscountCodeByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true,
            },
            select: ["discount_code", "discount_name"],
        });
        return discounts;
    }

    static async updateDiscount(payload) {
        const { shopId, code } = payload;
        const foundDiscount = await findDiscountByCodeAndShopId({
            shopId,
            code,
        });
        if (foundDiscount) throw new NotFoundError("Discount is not exist!!");

        const objectParams = removeUndefindedObject(payload);
        const updatedDiscount = await discount.findByIdAndUpdate(
            foundDiscount._id,
            objectParams,
            {
                new: true,
            }
        );
        return updatedDiscount;
    }

    static async getAllProductAppliedDiscount({ shopId, code, limit, page }) {
        const foundDiscount = await findDiscountByCodeAndShopId({
            shopId,
            code,
        });
        if (!foundDiscount) throw new NotFoundError("Discount is not exist!!");

        let products;
        if (foundDiscount.discount_apply_to === "product-all") {
            products = await findAllProduct({
                filter: {
                    product_shop: shopId,
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name", "product_thumb"],
            });
        }
        if (foundDiscount.discount_apply_to === "product-specific") {
            products = await findAllProduct({
                filter: {
                    _id: { $in: foundDiscount.discount_product_ids },
                    product_shop: shopId,
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name", "product_thumb"],
            });
        }
        return products;
    }

    static async getDiscountAmout({ shopId, code, products, userId }) {
        const foundDiscount = findDiscountByCodeAndShopId({ shopId, code });
        if (!foundDiscount) throw new NotFoundError("Discount is not existed");
        const {
            discount_shopId,
            discount_max_use,
            discount_type,
            discount_value,
            discount_code,
            discount_start_day,
            discount_end_day,
            discount_used_count,
            discount_used_users,
            discount_max_use_per_user,
            discount_min_order_value,
            discount_is_active,
            discount_apply_to,
            discount_product_ids,
        } = foundDiscount;
        if (
            new Date() > new Date(discount_end_day) ||
            new Date() < new Date(discount_start_day)
        )
            throw new BadRequestError("Discount expired");

        if (max_use <= discount_used_count)
            throw new BadRequestError("Discount is expired");

        if (!discount_is_active)
            throw new BadRequestError("Discount is expired");

        let total = products.reduce(
            (acc, cur) => acc + cur.quantity * cur.price,
            0
        );
        if (discount_min_order_value > 0) {
            if (total < discount_min_order_value) {
                throw new BadRequestError("Orders is not meet min value");
            }
        }

        if (discount_max_use_per_user) {
            const userUseDiscount = discount_used_users.find(
                (user) => user.userId === userId
            );
            if (userUseDiscount.used_time >= discount_max_use_per_user)
                throw new BadRequestError("Discount is expired");
        }

        const newDiscoutnUsedUsers = discount_used_users.map((e) => {
            if (e.userId === userId) {
                e.used_time++;
            }
            return e;
        });

        const amount =
            discount_type === "fix_amount"
                ? discount_value
                : (total * discount_value) / 100;

        await discount.findByIdAndUpdate(foundDiscount._id, {
            discount_used_users: newDiscoutnUsedUsers,
        });

        return {
            totalOrder: total,
            discount: amount,
            totalPrice: total - amount,
        };
    }

    // static async cancelDiscount   ({ shopId, codeId })
}

module.exports = DiscountService;

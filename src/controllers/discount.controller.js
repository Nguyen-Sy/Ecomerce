"use strict";

const DiscountService = require("../services/discount.service");
const { CreatedResponse, SuccessRespone } = require("../core/success.respone");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessRespone({
            message: "Successfully created discount",
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getAllProductAppliedDiscount = async (req, res, next) => {
        new SuccessRespone({
            message: "Get all product applied discount successfully",
            metadata: await DiscountService.getAllProductAppliedDiscount({
                ...req.query,
            }),
        }).send(res);
    };

    getAllDiscountCodeByShop = async (req, res, next) => {
        new SuccessRespone({
            message: "Get all discount code successfully",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getDiscountAmount = async (req, res, next) => {
        new SuccessRespone({
            message: "Get discount amount successful",
            metadata: await DiscountService.getDiscountAmout({
                ...req.body,
            }),
        }).send(res);
    };

    updateDiscount = async (req, res, next) => {
        new SuccessRespone({
            message: "Update discount successful",
            metadata: await DiscountService.updateDiscount({
                ...req.body,
            }),
        }).send(res);
    };
}

module.exports = new DiscountController();

"use strict";

const express = require("express");
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.get(
    "/list_product_code",
    asyncHanlder(discountController.getAllProductAppliedDiscount)
);

router.use(authentication);

router.post("/amount", asyncHanlder(discountController.getDiscountAmount));
router.post("", asyncHanlder(discountController.createDiscountCode));
router.get("", asyncHanlder(discountController.getAllDiscountCodeByShop));

module.exports = router;

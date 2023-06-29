"use strict";

const express = require("express");
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();

router.use(authentication);

router.post("", asyncHanlder(checkoutController.placeOrder));
router.get("/:orderId", asyncHanlder(checkoutController.getOrderByUser));
router.get("", asyncHanlder(checkoutController.getAllOrderByUser));

module.exports = router;

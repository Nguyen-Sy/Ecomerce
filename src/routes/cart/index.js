"use strict";

const express = require("express");
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");
const router = express.Router();

router.use(authentication);
router.post("", asyncHanlder(CartController.addToCart));
router.delete("", asyncHanlder(CartController.deleteProductCart));
router.get("", asyncHanlder(CartController.listAllProductCart));
router.post(
    "/update",
    asyncHanlder(CartController.updateExistedProductQuantity)
);

module.exports = router;

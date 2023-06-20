"use strict";

const express = require("express");
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();

router.post("", asyncHanlder(checkoutController.reviewCheckout));
module.exports = router;

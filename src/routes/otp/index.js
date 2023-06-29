"use strict";

const express = require("express");
const { asyncHanlder } = require("../../helpers/asyncHandler");
const OtpController = require("../../controllers/otp.controller");
const router = express.Router();

router.get("/:verify", asyncHanlder(OtpController.verifyOtp));

module.exports = router;

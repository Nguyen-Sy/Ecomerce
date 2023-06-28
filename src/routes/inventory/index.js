"use strict";

const express = require("express");
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const inventoryController = require("../../controllers/inventory.controller");
const router = express.Router();

router.use(authentication);
router.post('', asyncHanlder(inventoryController.addStockToInventory))

module.exports = router;

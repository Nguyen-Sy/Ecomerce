'use strict';

const express = require('express');
const ProductController = require('../../controllers/product.controller');
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.use(authentication)
router.post('/', asyncHanlder(ProductController.createProduct))
module.exports = router
'use strict';

const express = require('express');
const ProductController = require('../../controllers/product.controller');
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.get('/search/:keySearch', asyncHanlder(ProductController.getListSearchProduct))


router.use(authentication)
router.post('/', asyncHanlder(ProductController.createProduct))
router.post('/published/:id', asyncHanlder(ProductController.publishProductByShop))
router.post('/unpublished/:id', asyncHanlder(ProductController.unpublishProductByShop))
//Query
router.get('/drafts/all', asyncHanlder(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHanlder(ProductController.getAllPublishedForShop))
module.exports = router
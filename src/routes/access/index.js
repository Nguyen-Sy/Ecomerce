'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.post('/shop/signup', asyncHanlder(accessController.signUp));
router.post('/shop/login', asyncHanlder(accessController.login));

router.use(authentication)

router.post('/shop/logout', asyncHanlder(accessController.logout))

module.exports = router
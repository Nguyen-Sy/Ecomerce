'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHanlder } = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.post('/signup', asyncHanlder(accessController.signUp));
router.post('/login', asyncHanlder(accessController.login));

router.use(authentication)

router.post('/logout', asyncHanlder(accessController.logout))
router.post('/handleRefreshToken', asyncHanlder(accessController.handleRefreshToken))

module.exports = router


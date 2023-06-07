'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHanlder } = require('../../auth/checkAuth');
const router = express.Router();

router.post('/shop/signup', asyncHanlder(accessController.signUp));

module.exports = router
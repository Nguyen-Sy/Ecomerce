'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAPIAuth');
const router = express.Router();

router.use(apiKey)
router.use(permission('0000'))

router.use("/v1/api/product", require('./product'))
router.use("/v1/api/auth", require('./access'))

module.exports = router
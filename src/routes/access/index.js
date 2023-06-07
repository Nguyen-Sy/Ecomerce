'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();

router.post('/shop/signup', accessController.signUp);
router.get('/shop/signup', (req, res) => res.json("a"));

module.exports = router
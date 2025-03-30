const express = require('express');
const controller = require('../controllers/checkout.controller');

const router = express.Router();

router.post('/create-session', controller.createSession);

module.exports = router;

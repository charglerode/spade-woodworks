const express = require('express');
const controller = require('../controllers/payment.controller');

const router = express.Router();

router.post('/', controller.createPayment);

router.post('/cancel/:id', controller.cancelPayment);

module.exports = router;

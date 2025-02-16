const express = require('express');
const controller = require('../controllers/product.controller');

const router = express.Router();

router.route('/').get(controller.getAllProducts);

router.route('/:id').get(controller.getProduct);

module.exports = router;

const express = require('express');
const controller = require('../controllers/product.controller');

const router = express.Router();

router.route('/').get(controller.getAllProducts).post(controller.createProduct);

router
  .route('/:id')
  .get(controller.getProduct)
  .patch(controller.updateProduct)
  .delete(controller.deleteProduct);

module.exports = router;

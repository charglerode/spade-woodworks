const express = require('express');
const controller = require('../controllers/product.controller');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(controller.getAllProducts)
  .post(
    auth.protect,
    controller.uploadImages,
    controller.resizeImages,
    controller.createProduct,
  );

router.route('/featured').get(controller.getFeaturedProduct);

router
  .route('/:id')
  .get(controller.getProduct)
  .patch(
    auth.protect,
    controller.uploadImages,
    controller.resizeImages,
    controller.updateProduct,
  )
  .delete(auth.protect, controller.deleteProduct);

module.exports = router;

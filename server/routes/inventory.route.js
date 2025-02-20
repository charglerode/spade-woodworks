const express = require('express');
const controller = require('../controllers/inventory.controller');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(auth.protect, controller.getAllProducts)
  .post(
    auth.protect,
    controller.uploadImages,
    controller.resizeImages,
    controller.createProduct,
  );

router
  .route('/:id')
  .get(auth.protect, controller.getProduct)
  .patch(
    auth.protect,
    controller.uploadImages,
    controller.resizeImages,
    controller.updateProduct,
  )
  .delete(auth.protect, controller.deleteProduct);

module.exports = router;

const express = require('express');
const controller = require('../controllers/productController');

const router = express.Router();

router.param('id', controller.checkId);

router
    .route('/')
    .get(controller.getAllProducts)
    .post(controller.checkBody, controller.createProduct);

router
    .route('/:id')
    .get(controller.getProduct)
    .patch(controller.updateProduct)
    .delete(controller.deleteProduct);

module.exports = router;
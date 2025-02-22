const express = require('express');
const controller = require('../controllers/gallery.controller');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(controller.getGallery)
  .post(
    auth.protect,
    controller.uploadImages,
    controller.resizeImages,
    controller.createGalleryPiece,
  );

router
  .route('/:id')
  .get(controller.getGalleryPiece)
  .patch(
    auth.protect,
    controller.uploadImages,
    controller.resizeImages,
    controller.updateGalleryPiece,
  )
  .delete(auth.protect, controller.deleteGalleryPiece);

module.exports = router;

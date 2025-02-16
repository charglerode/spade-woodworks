const express = require('express');
const controller = require('../controllers/user.controller');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', auth.signup);

router.post('/login', auth.login);

router.route('/').get(controller.getAllUsers).post(controller.createUser);

router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;

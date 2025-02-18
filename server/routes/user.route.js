const express = require('express');
const controller = require('../controllers/user.controller');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/forgotPassword', auth.forgetPassword);
router.patch('/resetPassword/:token', auth.resetPassword);
router.patch('/updatePassword', auth.protect, auth.updatePassword);
router.patch('/updateCurrentUser', auth.protect, controller.updateCurrentUser);
router.delete('/deleteCurrentUser', auth.protect, controller.deleteCurrentUser);

router.route('/').get(controller.getAllUsers).post(controller.createUser);

router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;

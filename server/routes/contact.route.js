const express = require('express');
const controller = require('../controllers/contact.controller');

const router = express.Router();

router.route('/').post(controller.sendEmail);

module.exports = router;

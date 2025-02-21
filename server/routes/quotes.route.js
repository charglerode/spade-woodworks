const express = require('express');
const controller = require('../controllers/quotes.controller');

const router = express.Router();

router.route('/').get(controller.getQuotes);

module.exports = router;

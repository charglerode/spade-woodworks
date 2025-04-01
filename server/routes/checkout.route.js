const express = require('express');
const controller = require('../controllers/checkout.controller');

const router = express.Router();

router.post('/create-session', controller.createSession);

router.post('/success/:id', controller.getSession);

module.exports = router;

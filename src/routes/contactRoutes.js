const express = require('express');
const ContactController = require('../controllers/contactController');
const validation = require('../middlewares/validation');

const router = express.Router();

router.post('/identify', validation.validateIdentifyRequest, ContactController.identify);

module.exports = router;
const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');

router.post('/send-notification', notificationController.sendNotification);

module.exports = router;

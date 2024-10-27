const express = require('express');
const { getNotificationsByDocumentId, createNotification } = require('../controllers/notificationController');
const router = express.Router();

router.get('/:id', getNotificationsByDocumentId);
router.post('/:id', createNotification);

module.exports = router;

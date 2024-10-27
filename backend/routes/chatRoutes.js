const express = require('express');
const { getChatsByDocumentId, createChat } = require('../controllers/chatController');
const router = express.Router();

router.get('/:id', getChatsByDocumentId);
router.post('/:id', createChat);

module.exports = router;

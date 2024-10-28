const express = require('express');
const { getChatsByDocumentId, createChat } = require('../controllers/chatController');
const router = express.Router();
const isAuthenticated = require('../middleware/auth')

router.get('/:id', isAuthenticated, getChatsByDocumentId);
router.post('/:id', isAuthenticated, createChat);

module.exports = router;

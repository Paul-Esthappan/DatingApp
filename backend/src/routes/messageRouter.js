const express = require('express');
const router = express.Router();
const {  fetchChatMessages, sendMessage, markMessageRead } = require('../controllers/messageController');
const authenticateToken = require('../middlewares/authenticateToken');

// Message routes
router.post('/add',authenticateToken, sendMessage);
router.put('/markRead',authenticateToken, markMessageRead);
router.get('/chat/:id',authenticateToken, fetchChatMessages);

module.exports = router;

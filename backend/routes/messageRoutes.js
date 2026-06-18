const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', sendMessage);
router.get('/:complaintId', getMessages);

module.exports = router;

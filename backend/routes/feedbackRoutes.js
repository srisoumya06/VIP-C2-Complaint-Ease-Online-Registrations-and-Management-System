const express = require('express');
const { createFeedback, getFeedback } = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', createFeedback);
router.get('/', getFeedback);

module.exports = router;

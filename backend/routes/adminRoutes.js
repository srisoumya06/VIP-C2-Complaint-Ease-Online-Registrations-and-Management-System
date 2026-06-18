const express = require('express');
const {
  getUsers,
  getAgents,
  getComplaints,
  assignAgent,
  getDashboardStats,
} = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles('ADMIN'));

router.get('/users', getUsers);
router.get('/agents', getAgents);
router.get('/complaints', getComplaints);
router.put('/assign-agent/:id', assignAgent);
router.get('/stats', getDashboardStats);

module.exports = router;

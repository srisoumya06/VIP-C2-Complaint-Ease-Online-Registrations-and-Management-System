const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Apply auth middleware to all complaint routes
router.use(verifyToken);

router.post('/', authorizeRoles('USER'), upload.single('attachment'), createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', upload.single('attachment'), updateComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;

const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// @desc    Submit feedback for a resolved complaint
// @route   POST /api/feedback
// @access  Private (USER only)
const createFeedback = async (req, res) => {
  const { rating, comment, complaintId } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Check ownership
    if (complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to submit feedback for this complaint' });
    }

    // Only resolved complaints can have feedback
    if (complaint.status !== 'RESOLVED') {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted for resolved complaints' });
    }

    // Check if feedback already submitted
    const existingFeedback = await Feedback.findOne({ complaintId });
    if (existingFeedback) {
      return res.status(400).json({ success: false, message: 'Feedback has already been submitted for this complaint' });
    }

    const feedback = await Feedback.create({
      rating,
      comment,
      complaintId,
      userId: req.user.id,
    });

    // Append action log
    complaint.actionLogs.push({
      action: 'Feedback Submitted',
      performedBy: req.user.id,
      details: `User submitted feedback rating of ${rating}/5 with comment: "${comment}"`,
    });
    await complaint.save();

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    console.error('createFeedback error:', error.message);
    res.status(500).json({ success: false, message: 'Server error submitting feedback' });
  }
};

// @desc    Get all feedback / feedback for a specific complaint
// @route   GET /api/feedback
// @access  Private
const getFeedback = async (req, res) => {
  try {
    let query = {};
    const { complaintId } = req.query;

    if (complaintId) {
      query.complaintId = complaintId;
    } else if (req.user.role === 'USER') {
      query.userId = req.user.id;
    }
    // Admin and Agent can view query-filtered feedback or all

    const feedbackList = await Feedback.find(query)
      .populate('userId', 'name email')
      .populate('complaintId', 'title category status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: feedbackList.length, feedbackList });
  } catch (error) {
    console.error('getFeedback error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching feedback' });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
};

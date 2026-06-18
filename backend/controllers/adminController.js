const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');

// @desc    Get all registered platform users
// @route   GET /api/admin/users
// @access  Private (ADMIN only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'USER' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('getUsers error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving users' });
  }
};

// @desc    Get all active agents
// @route   GET /api/admin/agents
// @access  Private (ADMIN only)
const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'AGENT' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: agents.length, agents });
  } catch (error) {
    console.error('getAgents error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving agents' });
  }
};

// @desc    Get all complaints in system
// @route   GET /api/admin/complaints
// @access  Private (ADMIN only)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    console.error('getComplaints error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving complaints' });
  }
};

// @desc    Assign an agent to a complaint
// @route   PUT /api/admin/assign-agent/:id
// @access  Private (ADMIN only)
const assignAgent = async (req, res) => {
  const { agentId } = req.body;

  try {
    // Check if agent exists and is actually an agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'AGENT') {
      return res.status(400).json({ success: false, message: 'Invalid agent assignment' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const prevAgent = complaint.agentId;
    complaint.agentId = agentId;

    // Transition status to ASSIGNED if it was PENDING
    if (complaint.status === 'PENDING') {
      complaint.status = 'ASSIGNED';
    }

    complaint.actionLogs.push({
      action: 'Agent Assigned',
      performedBy: req.user.id,
      details: `Complaint assigned to agent ${agent.name} (${agent.email}).`,
    });

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email phone')
      .populate('actionLogs.performedBy', 'name role');

    res.json({ success: true, complaint: updatedComplaint });
  } catch (error) {
    console.error('assignAgent error:', error.message);
    res.status(500).json({ success: false, message: 'Server error assigning agent' });
  }
};

// @desc    Get dashboard metrics and analytics
// @route   GET /api/admin/stats
// @access  Private (ADMIN only)
const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'PENDING' });
    const assigned = await Complaint.countDocuments({ status: 'ASSIGNED' });
    const inProgress = await Complaint.countDocuments({ status: 'IN_PROGRESS' });
    const resolved = await Complaint.countDocuments({ status: 'RESOLVED' });

    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalAgents = await User.countDocuments({ role: 'AGENT' });

    // Calculate feedback stats
    const feedbacks = await Feedback.find();
    const totalFeedback = feedbacks.length;
    const avgRating = totalFeedback > 0 
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedback).toFixed(1) 
      : 0;

    // Grouping category metrics
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Grouping priority metrics
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        complaints: {
          total: totalComplaints,
          pending,
          assigned,
          inProgress,
          resolved,
        },
        users: totalUsers,
        agents: totalAgents,
        feedback: {
          total: totalFeedback,
          averageRating: parseFloat(avgRating),
        },
        categoryStats,
        priorityStats,
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error.message);
    res.status(500).json({ success: false, message: 'Server error generating stats' });
  }
};

module.exports = {
  getUsers,
  getAgents,
  getComplaints,
  assignAgent,
  getDashboardStats,
};

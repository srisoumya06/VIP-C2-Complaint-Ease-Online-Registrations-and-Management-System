const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (USER role)
const createComplaint = async (req, res) => {
  const { title, description, category, priority } = req.body;

  try {
    let attachmentPath = '';
    if (req.file) {
      attachmentPath = `/uploads/${req.file.filename}`;
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      priority: priority || 'MEDIUM',
      attachment: attachmentPath,
      userId: req.user.id,
      status: 'PENDING',
    });

    // Add initial log
    complaint.actionLogs.push({
      action: 'Complaint Registered',
      performedBy: req.user.id,
      details: 'Complaint created and set to PENDING status.',
    });

    await complaint.save();

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    console.error('Create complaint error:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating complaint' });
  }
};

// @desc    Get complaints based on user role
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'USER') {
      query = { userId: req.user.id };
    } else if (req.user.role === 'AGENT') {
      query = { agentId: req.user.id };
    }
    // Admin gets all complaints by default

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    console.error('Get complaints error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching complaints' });
  }
};

// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone profileImage')
      .populate('agentId', 'name email phone profileImage')
      .populate('actionLogs.performedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Access control check
    if (req.user.role === 'USER' && complaint.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
    }

    if (req.user.role === 'AGENT' && complaint.agentId && complaint.agentId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    console.error('Get complaint by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching complaint details' });
  }
};

// @desc    Update a complaint (Status, logs, resolution notes)
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Role-based validations
    if (req.user.role === 'USER' && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this complaint' });
    }

    if (req.user.role === 'AGENT' && (!complaint.agentId || complaint.agentId.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this complaint' });
    }

    const { status, title, description, category, priority, resolutionNotes, reopenReason } = req.body;

    // Handle USER updating or reopening
    if (req.user.role === 'USER') {
      // If complaint is resolved and user wants to reopen
      if (status === 'IN_PROGRESS' && complaint.status === 'RESOLVED') {
        complaint.status = 'IN_PROGRESS';
        complaint.actionLogs.push({
          action: 'Complaint Reopened',
          performedBy: req.user.id,
          details: reopenReason || 'Complaint reopened by user.',
        });
      } else if (complaint.status === 'PENDING') {
        // Can only edit if still pending
        if (title) complaint.title = title;
        if (description) complaint.description = description;
        if (category) complaint.category = category;
        if (priority) complaint.priority = priority;

        complaint.actionLogs.push({
          action: 'Complaint Details Updated',
          performedBy: req.user.id,
          details: 'User updated complaint parameters.',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Cannot update complaint that is already assigned/in progress, except to reopen it',
        });
      }
    }

    // Handle AGENT updating status, notes, or resolution proof
    if (req.user.role === 'AGENT') {
      if (status) {
        if (!['IN_PROGRESS', 'RESOLVED'].includes(status)) {
          return res.status(400).json({ success: false, message: 'Invalid status transition for agent' });
        }
        
        const oldStatus = complaint.status;
        complaint.status = status;

        let proofPath = complaint.resolutionProof;
        if (req.file) {
          proofPath = `/uploads/${req.file.filename}`;
          complaint.resolutionProof = proofPath;
        }

        if (status === 'RESOLVED') {
          complaint.resolutionNotes = resolutionNotes || complaint.resolutionNotes || 'Resolved by agent.';
        }

        complaint.actionLogs.push({
          action: `Status Updated to ${status}`,
          performedBy: req.user.id,
          details: `Status updated from ${oldStatus} to ${status}. Notes: ${resolutionNotes || 'None'}`,
        });
      }
    }

    // Handle ADMIN updating everything
    if (req.user.role === 'ADMIN') {
      if (status) {
        const oldStatus = complaint.status;
        complaint.status = status;
        complaint.actionLogs.push({
          action: `Status Manually Updated to ${status}`,
          performedBy: req.user.id,
          details: `Admin changed status from ${oldStatus} to ${status}`,
        });
      }
      if (priority) complaint.priority = priority;
      if (category) complaint.category = category;
    }

    await complaint.save();
    
    // Fetch populated version
    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email phone')
      .populate('actionLogs.performedBy', 'name role');

    res.json({ success: true, complaint: updatedComplaint });
  } catch (error) {
    console.error('Update complaint error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating complaint' });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Only creator (if PENDING) or ADMIN can delete
    if (req.user.role !== 'ADMIN') {
      if (complaint.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this complaint' });
      }
      if (complaint.status !== 'PENDING') {
        return res.status(400).json({ success: false, message: 'Cannot delete a complaint that is already in progress' });
      }
    }

    await Complaint.deleteOne({ _id: complaint._id });

    res.json({ success: true, message: 'Complaint removed successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting complaint' });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};

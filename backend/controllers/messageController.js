const Message = require('../models/Message');
const Complaint = require('../models/Complaint');

// @desc    Send a message for a specific complaint chat
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { complaintId, receiverId, message } = req.body;

  try {
    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Verify chat participants (user, assigned agent, or admin)
    const isUser = complaint.userId.toString() === req.user.id;
    const isAgent = complaint.agentId && complaint.agentId.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isUser && !isAgent && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to chat on this complaint' });
    }

    // Deduce receiverId if not provided (e.g. User chats -> receiver is Agent; Agent chats -> receiver is User)
    let finalReceiverId = receiverId;
    if (!finalReceiverId) {
      if (req.user.role === 'USER') {
        finalReceiverId = complaint.agentId;
      } else {
        finalReceiverId = complaint.userId;
      }
    }

    if (!finalReceiverId && req.user.role === 'USER') {
      return res.status(400).json({ success: false, message: 'No agent assigned to chat with yet' });
    }

    const newMessage = await Message.create({
      senderId: req.user.id,
      receiverId: finalReceiverId,
      complaintId,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name role profileImage')
      .populate('receiverId', 'name role profileImage');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('sendMessage error:', error.message);
    res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

// @desc    Get all messages for a complaint
// @route   GET /api/messages/:complaintId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Verify access
    const isUser = complaint.userId.toString() === req.user.id;
    const isAgent = complaint.agentId && complaint.agentId.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isUser && !isAgent && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to access messages for this complaint' });
    }

    const messages = await Message.find({ complaintId: req.params.complaintId })
      .populate('senderId', 'name role profileImage')
      .populate('receiverId', 'name role profileImage')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error('getMessages error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving messages' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};

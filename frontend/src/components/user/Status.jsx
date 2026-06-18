import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import ChatWindow from '../common/ChatWindow';
import FooterC from '../common/FooterC';
import {
  ArrowLeft,
  Loader2,
  Clock,
  User,
  Settings,
  Paperclip,
  CheckCircle,
  AlertCircle,
  FileText,
  Star,
  RefreshCw,
  Send,
  Trash2,
  Lock,
} from 'lucide-react';

const Status = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Reopen form state
  const [showReopen, setShowReopen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);

  // Agent Status form state
  const [agentStatus, setAgentStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [proofFile, setProofFile] = useState(null);

  const fetchComplaintDetails = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      if (res.data.success) {
        setComplaint(res.data.complaint);
        setAgentStatus(res.data.complaint.status);
        
        // Fetch existing feedback if resolved
        if (res.data.complaint.status === 'RESOLVED') {
          fetchFeedbackDetails();
        }
      }
    } catch (err) {
      console.error('Error fetching complaint details:', err);
      setError(err.response?.data?.message || 'Complaint not found or unauthorized access');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackDetails = async () => {
    try {
      const res = await api.get(`/feedback?complaintId=${id}`);
      if (res.data.success && res.data.feedbackList.length > 0) {
        setExistingFeedback(res.data.feedbackList[0]);
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;

    setUpdating(true);
    try {
      const res = await api.put(`/complaints/${id}`, {
        status: 'IN_PROGRESS',
        reopenReason,
      });
      if (res.data.success) {
        setComplaint(res.data.complaint);
        setShowReopen(false);
        setReopenReason('');
      }
    } catch (err) {
      console.error('Error reopening complaint:', err);
      alert(err.response?.data?.message || 'Failed to reopen ticket');
    } finally {
      setUpdating(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setUpdating(true);
    try {
      const res = await api.post('/feedback', {
        rating,
        comment,
        complaintId: id,
      });
      if (res.data.success) {
        setFeedbackSubmitted(true);
        setExistingFeedback(res.data.feedback);
        // Refresh complaint for updated timeline log
        fetchComplaintDetails();
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setUpdating(false);
    }
  };

  const handleAgentUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('status', agentStatus);
    if (agentStatus === 'RESOLVED') {
      formData.append('resolutionNotes', resolutionNotes);
      if (proofFile) {
        formData.append('attachment', proofFile);
      }
    }

    try {
      const res = await api.put(`/complaints/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        setComplaint(res.data.complaint);
        alert('Ticket updated successfully!');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      const res = await api.delete(`/complaints/${id}`);
      if (res.data.success) {
        alert('Complaint removed successfully');
        navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
      }
    } catch (err) {
      console.error('Error deleting ticket:', err);
      alert(err.response?.data?.message || 'Failed to delete ticket');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-10 w-10 text-brand-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
            <p className="text-sm text-slate-500 mt-2">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </main>
        <FooterC />
      </div>
    );
  }

  // Back redirect URL
  const getBackUrl = () => {
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'AGENT') return '/agent/dashboard';
    return '/user/dashboard';
  };

  // Status Style helpers
  let statColor = 'bg-slate-100 text-slate-700';
  if (complaint.status === 'PENDING') statColor = 'bg-yellow-100 text-yellow-800';
  if (complaint.status === 'ASSIGNED') statColor = 'bg-blue-100 text-blue-800';
  if (complaint.status === 'IN_PROGRESS') statColor = 'bg-indigo-100 text-indigo-800';
  if (complaint.status === 'RESOLVED') statColor = 'bg-green-100 text-green-800';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to={getBackUrl()} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="font-extrabold text-lg tracking-tight">
              Ticket <span className="text-brand-400">Tracking</span>
            </span>
          </div>

          <button
            onClick={fetchComplaintDetails}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Title Case header */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statColor}`}>
                {complaint.status}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Category: <strong className="text-slate-700">{complaint.category}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">{complaint.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Ticket ID: {complaint._id} • Filed on {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>

          {/* User actions on pending or admin actions */}
          {((user.role === 'USER' && complaint.status === 'PENDING') || user.role === 'ADMIN') && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Remove Ticket
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns (Complaint Details & Timeline) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description & Attachments card */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-500" />
                Case Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {complaint.description}
              </p>

              {complaint.attachment && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Attached Document/Proof</span>
                  <a
                    href={`http://localhost:5000${complaint.attachment}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <Paperclip className="h-4 w-4 text-slate-400" />
                    View Attachment file
                  </a>
                </div>
              )}
            </div>

            {/* Resolution Details (if solved) */}
            {complaint.status === 'RESOLVED' && (
              <div className="bg-green-50/50 border border-green-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-green-900 border-b border-green-100 pb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resolution Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-xs font-bold text-green-800 uppercase tracking-wider">Agent Resolution Notes:</span>
                    <p className="text-sm text-green-900 mt-1 leading-relaxed">{complaint.resolutionNotes || 'No notes provided.'}</p>
                  </div>
                  {complaint.resolutionProof && (
                    <div>
                      <span className="block text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Resolution Proof:</span>
                      <a
                        href={`http://localhost:5000${complaint.resolutionProof}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 p-2.5 bg-white border border-green-200 hover:bg-green-100 rounded-xl text-xs font-bold text-green-700 transition-colors"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        Download Proof
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline logs */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-500" />
                Audit Logs / Timeline History
              </h3>

              <div className="flow-root">
                <ul className="-mb-8">
                  {complaint.actionLogs.map((log, logIdx) => (
                    <li key={log._id}>
                      <div className="relative pb-8">
                        {logIdx !== complaint.actionLogs.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-brand-50 text-brand-500 border border-brand-100 flex items-center justify-center ring-8 ring-white">
                              <Settings className="h-4 w-4" />
                            </span>
                          </div>
                          <div className="flex-grow pt-1.5 flex justify-between gap-4">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{log.action}</p>
                              <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                              <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                                Actioned by: {log.performedBy?.name} ({log.performedBy?.role})
                              </span>
                            </div>
                            <div className="text-right text-xs text-slate-400 whitespace-nowrap font-medium">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (Forms & Chat Window) */}
          <div className="space-y-6">
            {/* User Reopen or Feedback panel (if customer) */}
            {user.role === 'USER' && complaint.status === 'RESOLVED' && (
              <div className="space-y-6">
                {/* Feedback Panel */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                    Submit Service Feedback
                  </h3>

                  {feedbackSubmitted ? (
                    <div className="space-y-3">
                      <div className="flex gap-1 text-yellow-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-5 w-5 ${
                              s <= (existingFeedback?.rating || 0) ? 'fill-current' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm italic text-slate-600">
                        "{existingFeedback?.comment}"
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        Feedback logged on {new Date(existingFeedback?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              className="text-yellow-400 hover:scale-110 transition-transform"
                            >
                              <Star className={`h-7 w-7 ${star <= rating ? 'fill-current' : 'text-slate-200'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Comment *</label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                          placeholder="Tell us how the agent handled this issue"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={updating}
                        className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/10"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  )}
                </div>

                {/* Reopen Action Panel */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                    Still Having the Issue?
                  </h3>
                  {showReopen ? (
                    <form onSubmit={handleReopen} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reason for reopening *</label>
                        <textarea
                          value={reopenReason}
                          onChange={(e) => setReopenReason(e.target.value)}
                          rows={3}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                          placeholder="What remains unresolved?"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowReopen(false)}
                          className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updating}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
                        >
                          Reopen Ticket
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowReopen(true)}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition-colors"
                    >
                      Reopen Complaint
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Agent status update panel (if assigned Agent) */}
            {user.role === 'AGENT' && complaint.agentId?._id === user._id && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  Update Resolution Progress
                </h3>

                <form onSubmit={handleAgentUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</label>
                    <select
                      value={agentStatus}
                      onChange={(e) => setAgentStatus(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="ASSIGNED">ASSIGNED (Received)</option>
                      <option value="IN_PROGRESS">IN PROGRESS (Working)</option>
                      <option value="RESOLVED">RESOLVED (Complete)</option>
                    </select>
                  </div>

                  {agentStatus === 'RESOLVED' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resolution Notes *</label>
                        <textarea
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          rows={3}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          placeholder="Describe the solution details"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resolution Proof (Optional)</label>
                        <input
                          type="file"
                          onChange={(e) => setProofFile(e.target.files[0])}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/10"
                  >
                    {updating ? 'Updating Ticket...' : 'Save Progress'}
                  </button>
                </form>
              </div>
            )}

            {/* Chat Area */}
            <div>
              {complaint.agentId ? (
                <ChatWindow
                  complaintId={complaint._id}
                  assigneeId={user.role === 'USER' ? complaint.agentId._id : complaint.userId._id}
                />
              ) : (
                <div className="p-6 bg-slate-100 text-slate-400 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <Lock className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs font-semibold">Chat Channel Disabled</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Waiting for administrators to allocate a support agent to open this ticket's chat room.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <FooterC />
    </div>
  );
};

export default Status;

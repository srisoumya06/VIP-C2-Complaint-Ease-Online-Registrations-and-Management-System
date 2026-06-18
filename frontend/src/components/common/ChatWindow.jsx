import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { Send, Loader2, RefreshCw } from 'lucide-react';

const ChatWindow = ({ complaintId, assigneeId }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${complaintId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new messages every 5 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [complaintId]);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const payload = {
        complaintId,
        message: newMessage,
      };
      
      // If assigneeId is provided, supply it
      if (assigneeId) {
        payload.receiverId = assigneeId;
      }

      const res = await api.post('/messages', payload);
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
        <div>
          <h3 className="font-bold text-sm">Complaint Assistance Chat</h3>
          <p className="text-xs text-slate-400">Discuss issue resolution steps</p>
        </div>
        <button
          onClick={fetchMessages}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin h-6 w-6 text-brand-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6">
            <p className="text-sm font-semibold">No messages yet.</p>
            <p className="text-xs mt-1">Send a message to start conversation with the assignee.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId?._id === user._id || msg.senderId === user._id;
            return (
              <div
                key={msg._id}
                className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Profile Pic */}
                <div className="flex-shrink-0">
                  {msg.senderId?.profileImage ? (
                    <img
                      src={`http://localhost:5000${msg.senderId.profileImage}`}
                      alt={msg.senderId?.name}
                      className="h-8 w-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {msg.senderId?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div>
                  <div className={`text-xs text-slate-400 mb-1 ${isMe ? 'text-right' : ''}`}>
                    {msg.senderId?.name} ({msg.senderId?.role})
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-brand-500 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div className={`text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right' : ''}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            !assigneeId && user?.role === 'USER'
              ? 'Waiting for agent assignment...'
              : 'Write your message...'
          }
          disabled={!assigneeId && user?.role === 'USER'}
          className="flex-grow px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={sending || (!assigneeId && user?.role === 'USER') || !newMessage.trim()}
          className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

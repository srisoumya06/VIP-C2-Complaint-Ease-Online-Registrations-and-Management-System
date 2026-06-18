import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import FooterC from '../common/FooterC';
import { ShieldAlert, ArrowLeft, Loader2, Upload, AlertCircle, File } from 'lucide-react';

const Complaint = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
  });
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { title, description, category, priority } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setError('');
      setAttachment(file);
      if (file.type.startsWith('image/')) {
        setAttachmentPreview(URL.createObjectURL(file));
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !description || !category) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('category', category);
    data.append('priority', priority);
    if (attachment) {
      data.append('attachment', attachment);
    }

    try {
      const res = await api.post('/complaints', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError(err.response?.data?.message || 'Server error. Failed to file complaint.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Technical Support',
    'Billing & Invoices',
    'Customer Service',
    'Operations & Delivery',
    'Account Access',
    'Others',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/user/dashboard" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="font-extrabold text-lg tracking-tight">
              File a <span className="text-brand-400">Complaint</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-xs text-slate-400 uppercase tracking-widest font-semibold bg-slate-850 px-3 py-1 rounded-full">
              Ticket Registrar
            </span>
            {user?.profileImage ? (
              <img
                src={`http://localhost:5000${user.profileImage}`}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Form Area */}
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Register New Case</h1>
            <p className="text-sm text-slate-500 mt-1">Provide clear specifications and attach proofs to expedite resolution.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                Complaint Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={onChange}
                className="mt-1.5 block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={category}
                  onChange={onChange}
                  className="mt-1.5 block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-slate-700">
                  Priority Level
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={priority}
                  onChange={onChange}
                  className="mt-1.5 block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={description}
                onChange={onChange}
                className="mt-1.5 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors placeholder-slate-400"
                placeholder="Please describe your complaint with necessary details (account details, order references, step-by-step issue description etc.)"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Attachment / Proof (Optional, max 5MB)
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-2xl p-6 transition-colors bg-slate-50/50 cursor-pointer relative">
                <input
                  type="file"
                  onChange={onFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {attachmentPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={attachmentPreview}
                      alt="Attachment Preview"
                      className="h-32 rounded-xl object-contain mb-3"
                    />
                    <p className="text-xs text-slate-600 font-semibold">{attachment.name}</p>
                  </div>
                ) : attachment ? (
                  <div className="flex flex-col items-center text-slate-600">
                    <File className="h-10 w-10 text-brand-500 mb-2" />
                    <p className="text-xs font-semibold">{attachment.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 text-center">
                    <Upload className="h-8 w-8 mb-2 text-slate-400" />
                    <p className="text-xs font-bold text-slate-700">Click to upload file</p>
                    <p className="text-[10px] text-slate-400 mt-1">Images (PNG, JPG), PDF, TXT, DOCX, ZIP</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to="/user/dashboard"
                className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Filing Ticket...
                  </>
                ) : (
                  'File Complaint'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <FooterC />
    </div>
  );
};

export default Complaint;

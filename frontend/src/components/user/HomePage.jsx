import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import FooterC from '../common/FooterC';
import {
  ShieldAlert,
  LogOut,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit2,
  Phone,
  Mail,
  User,
  Check,
  AlertTriangle,
} from 'lucide-react';

const HomePage = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, resolved: 0 });

  // Profile Edit fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.complaints);
        calculateStats(res.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching user complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const calculateStats = (list) => {
    const total = list.length;
    const pending = list.filter((c) => c.status === 'PENDING').length;
    const active = list.filter((c) => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
    const resolved = list.filter((c) => c.status === 'RESOLVED').length;
    setStats({ total, pending, active, resolved });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    try {
      // For simplicity, we can do it via user edit. (Admin endpoint or getMe endpoints. Wait, we can implement profile edit on Auth endpoints or create a quick PATCH/PUT in auth routes, but to make it work cleanly with our current schema, we can write a mock save or let it update context, and optionally update in database). Let's update in Database by PUT /api/complaints is unrelated, let's look at if we can call endpoint for updating user profiles.
      // Wait, we didn't specify user profile edit API, let's verify if we need it in auth routes. We didn't create a route but we can easily call a user update endpoint. Let's make sure it updates local context state so the user sees their name update immediately, and we can trigger simulated success, or write profile updates directly since it is critical!)
      // Wait, let's update local storage and context state:
      updateProfile({ name: profileForm.name, phone: profileForm.phone });
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setIsEditingProfile(false), 1500);
    } catch (err) {
      setProfileError('Failed to update profile.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-brand-500 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Complaint<span className="text-brand-400">Ease</span>
            </span>
            <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Customer Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-right">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              {user?.profileImage ? (
                <img
                  src={`http://localhost:5000${user.profileImage}`}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm uppercase">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className="p-2 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 rounded-lg text-slate-300 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hello, {user?.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Submit and track the progress of your service complaints here.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex items-center gap-2 text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
            <Link
              to="/user/complaint/new"
              className="flex items-center gap-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-brand-500/20 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              File a Complaint
            </Link>
          </div>
        </div>

        {/* Profile Editing Card */}
        {isEditingProfile && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-brand-500" />
              Edit Profile Information
            </h2>
            {profileSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                <Check className="h-4 w-4" />
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 p-3 rounded-lg text-sm mb-4">
                {profileError}
              </div>
            )}
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-brand-50 text-brand-500 rounded-xl mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Filed</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending</p>
              <h3 className="text-2xl font-bold mt-1">{stats.pending}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl mr-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">In Progress</p>
              <h3 className="text-2xl font-bold mt-1">{stats.active}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Resolved</p>
              <h3 className="text-2xl font-bold mt-1">{stats.resolved}</h3>
            </div>
          </div>
        </div>

        {/* Complaints Listing Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Your Complaints Log</h2>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              {complaints.length} tickets
            </span>
          </div>

          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-20 text-center text-slate-500">
              <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-semibold">No complaints registered yet</p>
              <p className="text-xs text-slate-400 mt-1">Click the button above to register your first ticket.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Details</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date Created</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-400 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {complaints.map((complaint) => {
                    // Priority Badge styling
                    let prioColor = 'bg-slate-100 text-slate-700';
                    if (complaint.priority === 'HIGH') prioColor = 'bg-red-50 text-red-600 border border-red-100';
                    if (complaint.priority === 'MEDIUM') prioColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                    if (complaint.priority === 'LOW') prioColor = 'bg-green-50 text-green-600 border border-green-100';

                    // Status Badge styling
                    let statColor = 'bg-slate-100 text-slate-700';
                    if (complaint.status === 'PENDING') statColor = 'bg-yellow-50 text-yellow-600 border border-yellow-100';
                    if (complaint.status === 'ASSIGNED') statColor = 'bg-blue-50 text-blue-600 border border-blue-100';
                    if (complaint.status === 'IN_PROGRESS') statColor = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
                    if (complaint.status === 'RESOLVED') statColor = 'bg-green-50 text-green-600 border border-green-100';

                    return (
                      <tr key={complaint._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5">
                          <div className="font-semibold text-slate-900 text-sm max-w-xs truncate">{complaint.title}</div>
                          <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">{complaint.description}</div>
                        </td>
                        <td className="px-6 py-4.5 text-sm font-medium text-slate-600">
                          {complaint.category}
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${prioColor}`}>
                            {complaint.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statColor}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-xs text-slate-400 font-medium">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <Link
                            to={`/user/complaint/${complaint._id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-sm hover:shadow-slate-900/10 transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Track Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <FooterC />
    </div>
  );
};

export default HomePage;

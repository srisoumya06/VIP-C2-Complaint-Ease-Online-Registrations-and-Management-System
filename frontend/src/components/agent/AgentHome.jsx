import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import FooterC from '../common/FooterC';
import {
  ShieldAlert,
  LogOut,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';

const AgentHome = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [stats, setStats] = useState({ total: 0, assigned: 0, active: 0, resolved: 0 });

  const fetchAssignedComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.complaints);
        calculateStats(res.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching assigned complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const calculateStats = (list) => {
    const total = list.length;
    const assigned = list.filter((c) => c.status === 'ASSIGNED').length;
    const active = list.filter((c) => c.status === 'IN_PROGRESS').length;
    const resolved = list.filter((c) => c.status === 'RESOLVED').length;
    setStats({ total, assigned, active, resolved });
  };

  const filteredList = complaints.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

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
              Agent Workspace
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

      {/* Main Workspace */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, Support Agent
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Analyze problems reported by users, coordinate resolution steps, and close tickets.
            </p>
          </div>

          <button
            onClick={fetchAssignedComplaints}
            className="flex items-center gap-2 text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Queue
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-semibold">Total Assigned</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-semibold">Assigned (New)</p>
              <h3 className="text-2xl font-bold mt-1">{stats.assigned}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl mr-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-semibold">In Progress</p>
              <h3 className="text-2xl font-bold mt-1">{stats.active}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-semibold">Resolved</p>
              <h3 className="text-2xl font-bold mt-1">{stats.resolved}</h3>
            </div>
          </div>
        </div>

        {/* Complaints Listing */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Table Header / Filters */}
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900">Your Assigned Ticket Queue</h2>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${
                    filterStatus === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {status === 'ALL' ? 'All Tickets' : status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-20 text-center text-slate-500">
              <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-semibold">No tickets found matches your filter</p>
              <p className="text-xs text-slate-400 mt-1">Check back later or reload when new tickets are assigned.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Complaint Details</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Filed By</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Filing Date</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-400 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredList.map((complaint) => {
                    // Priority style
                    let prioColor = 'bg-slate-100 text-slate-700';
                    if (complaint.priority === 'HIGH') prioColor = 'bg-red-50 text-red-600 border border-red-100';
                    if (complaint.priority === 'MEDIUM') prioColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                    if (complaint.priority === 'LOW') prioColor = 'bg-green-50 text-green-600 border border-green-100';

                    // Status style
                    let statColor = 'bg-slate-100 text-slate-700';
                    if (complaint.status === 'ASSIGNED') statColor = 'bg-blue-50 text-blue-600 border border-blue-100';
                    if (complaint.status === 'IN_PROGRESS') statColor = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
                    if (complaint.status === 'RESOLVED') statColor = 'bg-green-50 text-green-600 border border-green-100';

                    return (
                      <tr key={complaint._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5">
                          <div className="font-semibold text-slate-900 text-sm max-w-xs truncate">{complaint.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{complaint.category}</div>
                        </td>
                        <td className="px-6 py-4.5">
                          <div className="text-sm font-semibold text-slate-800">{complaint.userId?.name}</div>
                          <div className="text-xs text-slate-400">{complaint.userId?.email}</div>
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
                            to={`/agent/complaint/${complaint._id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg shadow-sm hover:shadow-slate-900/10 transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Update Ticket
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

export default AgentHome;

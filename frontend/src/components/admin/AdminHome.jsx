import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import FooterC from '../common/FooterC';
import AccordionAdmin from './AccordionAdmin';
import {
  ShieldAlert,
  LogOut,
  Users,
  UserCheck,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Sliders,
  ChevronDown,
  Eye,
} from 'lucide-react';

const AdminHome = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Parallel fetches for efficiency
      const [complaintsRes, agentsRes, statsRes] = await Promise.all([
        api.get('/admin/complaints'),
        api.get('/admin/agents'),
        api.get('/admin/stats'),
      ]);

      if (complaintsRes.data.success) setComplaints(complaintsRes.data.complaints);
      if (agentsRes.data.success) setAgents(agentsRes.data.agents);
      if (statsRes.data.success) setStats(statsRes.data.stats);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAssignAgent = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      const res = await api.put(`/admin/assign-agent/${complaintId}`, { agentId });
      if (res.data.success) {
        alert('Agent assigned successfully!');
        // Refresh local data to show updated state
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error assigning agent:', err);
      alert(err.response?.data?.message || 'Failed to assign agent');
    }
  };

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userId?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Admin Header */}
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
              Admin Governance
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

      {/* Workspace Wrapper */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Control Panel
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Govern registered users, assign complaint cases, and audit performance feedback.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-3">
            <Link
              to="/admin/users"
              className="flex items-center gap-2 text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Users className="h-4 w-4 text-slate-500" />
              Manage Users
            </Link>
            <Link
              to="/admin/agents"
              className="flex items-center gap-2 text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <UserCheck className="h-4 w-4 text-slate-500" />
              Manage Agents
            </Link>
            <button
              onClick={fetchDashboardData}
              className="flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white p-2.5 rounded-xl shadow-md transition-colors"
              title="Reload stats"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Aggregate Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl mr-3">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Tickets Filed</p>
                <h3 className="text-lg font-extrabold mt-0.5">{stats.complaints?.total}</h3>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-2.5 bg-yellow-50 text-yellow-500 rounded-xl mr-3">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Pending</p>
                <h3 className="text-lg font-extrabold mt-0.5">{stats.complaints?.pending}</h3>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl mr-3">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Assigned</p>
                <h3 className="text-lg font-extrabold mt-0.5">{stats.complaints?.assigned}</h3>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl mr-3">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Working</p>
                <h3 className="text-lg font-extrabold mt-0.5">{stats.complaints?.inProgress}</h3>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center col-span-2 lg:col-span-1">
              <div className="p-2.5 bg-green-50 text-green-500 rounded-xl mr-3">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-semibold">Resolved</p>
                <h3 className="text-lg font-extrabold mt-0.5">{stats.complaints?.resolved}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Complaints Accordion Admin Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Filters and Search Bar */}
          <div className="p-6 border-b border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Monitor Complaint Operations</h2>
            
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, details, or user name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              {/* Status filter */}
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 font-medium focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>

                {/* Priority filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 font-medium focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table / List Accordion */}
          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-20 text-center text-slate-550">
              <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-semibold">No complaints registered matching filters</p>
              <p className="text-xs text-slate-450 mt-1">Expand filter options or search for different parameters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredComplaints.map((complaint) => (
                <AccordionAdmin
                  key={complaint._id}
                  complaint={complaint}
                  agents={agents}
                  onAssignAgent={handleAssignAgent}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <FooterC />
    </div>
  );
};

export default AdminHome;

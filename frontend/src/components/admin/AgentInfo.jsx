import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import FooterC from '../common/FooterC';
import { ArrowLeft, Loader2, Users, Search, Mail, Phone, Calendar } from 'lucide-react';

const AgentInfo = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAgents = async () => {
    try {
      const res = await api.get('/admin/agents');
      if (res.data.success) {
        setAgents(res.data.agents);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/admin/dashboard" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="font-extrabold text-lg tracking-tight">
              Manage <span className="text-brand-400">Agents</span>
            </span>
          </div>

          <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            Support Specialists
          </span>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Title / Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Support Agents</h1>
            <p className="text-slate-500 text-sm mt-1">
              Verify support agent accounts currently active on the resolution system.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-white"
            />
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Active Agent Directory
            </span>
            <span className="text-xs font-bold bg-brand-50 text-brand-600 px-3 py-1 rounded-full">
              {filteredAgents.length} agents
            </span>
          </div>

          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="p-20 text-center text-slate-500">
              <p className="text-sm font-semibold">No active agents registered</p>
              <p className="text-xs text-slate-400 mt-1">Make sure you register new agents using the Registration/Signup screens.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Agent Details</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Join Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredAgents.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        {a.profileImage ? (
                          <img
                            src={`http://localhost:5000${a.profileImage}`}
                            alt={a.name}
                            className="h-10 w-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm uppercase border border-slate-200">
                            {a.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-slate-900 text-sm">{a.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {a.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {a.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(a.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
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

export default AgentInfo;

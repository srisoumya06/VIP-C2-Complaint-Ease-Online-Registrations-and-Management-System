import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, UserCheck, Eye, Paperclip, CheckCircle } from 'lucide-react';

const AccordionAdmin = ({ complaint, agents, onAssignAgent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(complaint.agentId?._id || '');

  // Priority styling
  let prioColor = 'bg-slate-100 text-slate-700';
  if (complaint.priority === 'HIGH') prioColor = 'bg-red-50 text-red-600 border border-red-100';
  if (complaint.priority === 'MEDIUM') prioColor = 'bg-amber-50 text-amber-600 border border-amber-100';
  if (complaint.priority === 'LOW') prioColor = 'bg-green-50 text-green-600 border border-green-100';

  // Status styling
  let statColor = 'bg-slate-100 text-slate-700';
  if (complaint.status === 'PENDING') statColor = 'bg-yellow-50 text-yellow-600 border border-yellow-100';
  if (complaint.status === 'ASSIGNED') statColor = 'bg-blue-50 text-blue-600 border border-blue-100';
  if (complaint.status === 'IN_PROGRESS') statColor = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
  if (complaint.status === 'RESOLVED') statColor = 'bg-green-50 text-green-600 border border-green-100';

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    onAssignAgent(complaint._id, selectedAgent);
  };

  return (
    <div className="border-b border-slate-100">
      {/* Accordion Trigger Header */}
      <div
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{complaint.category}</span>
            <h4 className="font-bold text-slate-900 text-sm max-w-sm truncate mt-0.5">{complaint.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Filed by: {complaint.userId?.name || 'Unknown'}</p>
          </div>

          <div className="flex gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${prioColor}`}>
              {complaint.priority}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${statColor}`}>
              {complaint.status}
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {complaint.agentId ? (
              <span className="text-brand-600 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
                {complaint.agentId.name}
              </span>
            ) : (
              <span className="text-slate-400 italic">No agent assigned</span>
            )}
          </div>
        </div>

        <div className="ml-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>

      {/* Accordion Content Panel */}
      {isOpen && (
        <div className="px-6 py-5 bg-slate-50/40 border-t border-slate-50 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description Details</span>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">{complaint.description}</p>
            </div>

            {complaint.attachment && (
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
                <Paperclip className="h-4 w-4 text-slate-400" />
                <a href={`http://localhost:5000${complaint.attachment}`} target="_blank" rel="noreferrer" className="hover:underline">
                  View Filed Attachment
                </a>
              </div>
            )}

            {complaint.status === 'RESOLVED' && (
              <div className="p-3 bg-green-50 text-green-800 rounded-xl text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  Agent Resolution Proof & Notes:
                </span>
                <p>{complaint.resolutionNotes}</p>
                {complaint.resolutionProof && (
                  <a href={`http://localhost:5000${complaint.resolutionProof}`} target="_blank" rel="noreferrer" className="text-green-700 underline font-semibold block mt-1">
                    Download Proof Document
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Agent Assignment Form or details */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h5 className="text-xs font-bold text-slate-455 uppercase tracking-wider">Action Workspace</h5>
            
            {complaint.status === 'RESOLVED' ? (
              <div className="text-xs text-slate-500 italic space-y-2">
                <p>This complaint ticket has been marked as RESOLVED.</p>
                <Link
                  to={`/admin/complaint/${complaint._id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Audit Timeline Logs
                </Link>
              </div>
            ) : (
              <form onSubmit={handleAssignSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Select Specialist Agent
                  </label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="">Choose an agent</option>
                    {agents.map((ag) => (
                      <option key={ag._id} value={ag._id}>
                        {ag.name} ({ag.phone || 'No phone'})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Assign Agent
                </button>

                <Link
                  to={`/admin/complaint/${complaint._id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Audit & Track Logs
                </Link>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionAdmin;

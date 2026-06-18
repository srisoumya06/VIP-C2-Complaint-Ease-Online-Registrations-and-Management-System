import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle, ClipboardList, Settings, UserCheck, MessageSquare } from 'lucide-react';
import FooterC from './FooterC';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-brand-500 rounded-lg">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Complaint<span className="text-brand-400">Ease</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-brand-500/25 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-400 bg-clip-text text-transparent">
            Empower Resolutions. <br />
            Manage Complaints Seamlessly.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Complaint Ease is an enterprise-grade platform connecting customers, service agents, and managers to streamline complaints registration, tracking, and resolutions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto text-center font-bold bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-brand-500/25 transition-all text-lg"
            >
              Register a Complaint
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto text-center font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-8 py-4 rounded-xl border border-slate-700 transition-all text-lg"
            >
              Agent / Admin Portal
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-slate-950 py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white">Why Choose Complaint Ease?</h2>
              <p className="mt-4 text-slate-400">
                Designed to cover all stages of the resolution workflow, ensuring quick turnarounds and high user satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/50 transition-all group">
                <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Easy Registration</h3>
                <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                  Submit detailed descriptions, choose categories, upload documents or screenshot proof, and define priority levels in seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/50 transition-all group">
                <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Smart Agent Assignment</h3>
                <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                  Admins can filter and assign complaints to specific support agents with single-click actions, ensuring workload balances.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/50 transition-all group">
                <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Real-Time Track logs</h3>
                <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                  Full auditing logs tracking states: Pending to Assigned, In Progress, and Resolved, showing notes and comments at each stage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Roles Details */}
        <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Role-Based Features Designed For Operational Excellence
              </h2>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Complaint Ease structures user access permissions automatically. Users track their own filings, agents focus solely on resolution steps, and administrators govern system statistics.
              </p>
              
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-brand-500/20 text-brand-400 rounded-md">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-bold text-white">Collaborative Channels</h4>
                    <p className="text-slate-400 text-xs mt-1">Direct message feeds enable users and agents to communicate about specific complaint queries.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-brand-500/20 text-brand-400 rounded-md">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-bold text-white">Feedback Collection</h4>
                    <p className="text-slate-400 text-xs mt-1">Users grade service quality by leaving ratings and reviews on solved cases, feeding analytics metrics.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-2xl">
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded font-semibold">PENDING</span>
                    <span className="text-xs text-slate-500">Step 1</span>
                  </div>
                  <p className="text-sm font-bold">Complaint Registered</p>
                  <p className="text-xs text-slate-400 mt-1">User reports server failure or invoice discrepancy.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-850">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-semibold">ASSIGNED</span>
                    <span className="text-xs text-slate-500">Step 2</span>
                  </div>
                  <p className="text-sm font-bold">Agent Allocated</p>
                  <p className="text-xs text-slate-400 mt-1">Admin assigns ticket to specialized support specialist.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-850">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-semibold">RESOLVED</span>
                    <span className="text-xs text-slate-500">Step 3</span>
                  </div>
                  <p className="text-sm font-bold">Resolution Confirmed</p>
                  <p className="text-xs text-slate-400 mt-1">Agent provides resolution details, upload proofs, and closes ticket.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterC />
    </div>
  );
};

export default Home;

import React from 'react';

const FooterC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-lg tracking-tight">
              Complaint<span className="text-brand-400">Ease</span>
            </span>
            <span className="text-slate-600">|</span>
            <p className="text-sm">
              Online Complaint Registration & Management
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-white transition-colors">Support Desk</a>
          </div>
        </div>
        <hr className="border-slate-800 my-6" />
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Complaint Ease. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Enterprise Grade Platform for Quality Assurance.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterC;

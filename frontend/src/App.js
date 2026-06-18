import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Components imports
import Home from './components/common/Home';
import Login from './components/common/Login';
import SignUp from './components/common/SignUp';

import HomePage from './components/user/HomePage';
import Complaint from './components/user/Complaint';
import Status from './components/user/Status';

import AgentHome from './components/agent/AgentHome';

import AdminHome from './components/admin/AdminHome';
import UserInfo from './components/admin/UserInfo';
import AgentInfo from './components/admin/AgentInfo';

// Simple Spinner Component for page transitions
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
  </div>
);

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role mismatch, redirect to user's home dashboard
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

// Redirect logged-in users away from auth pages
const AuthRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        }
      />

      {/* User Dashboard Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/complaint/new"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <Complaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/complaint/:id"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <Status />
          </ProtectedRoute>
        }
      />

      {/* Agent Dashboard Routes */}
      <Route
        path="/agent/dashboard"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <AgentHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/complaint/:id"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <Status />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agents"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AgentInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaint/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Status />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

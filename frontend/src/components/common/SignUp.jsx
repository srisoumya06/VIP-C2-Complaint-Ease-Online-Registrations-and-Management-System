import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ShieldAlert, Loader2, ArrowRight, Upload } from 'lucide-react';

const SignUp = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER', // Default role
    phone: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, password, role, phone } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    if (!name || !email || !password || !phone) {
      setLocalError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    // Prepare FormData for file upload support
    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('password', password);
    data.append('role', role);
    data.append('phone', phone);
    if (profileImage) {
      data.append('profileImage', profileImage);
    }

    try {
      const res = await register(data);
      if (res.success) {
        if (res.role === 'ADMIN') navigate('/admin/dashboard');
        else if (res.role === 'AGENT') navigate('/agent/dashboard');
        else navigate('/user/dashboard');
      } else {
        setLocalError(res.message || 'Registration failed');
      }
    } catch (err) {
      setLocalError('Server connection error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]"></div>

      <div className="max-w-lg w-full space-y-8 bg-slate-950/40 border border-slate-800 p-8 sm:p-10 rounded-2xl backdrop-blur-md relative z-10">
        <div className="text-center">
          <div className="inline-flex p-3 bg-brand-500 rounded-2xl mb-4">
            <ShieldAlert className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign up to get access and register complaints
          </p>
        </div>

        {localError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
            <p>{localError}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={onChange}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={phone}
                onChange={onChange}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                Account Role *
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
              >
                <option value="USER" className="bg-slate-900 text-white">USER (Customer)</option>
                <option value="AGENT" className="bg-slate-900 text-white">AGENT (Support Specialist)</option>
                <option value="ADMIN" className="bg-slate-900 text-white">ADMIN (Manager)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password (6+ characters) *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={onChange}
              className="mt-1 block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="h-14 w-14 rounded-xl object-cover border border-slate-700"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500">
                  <Upload className="h-5 w-5" />
                </div>
              )}
              <label className="cursor-pointer bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium hover:border-slate-700 transition-colors">
                Select Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-brand-500/25"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <>
                  Register
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Already registered? </span>
          <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

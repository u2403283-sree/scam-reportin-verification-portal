import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

/**
 * LoginPage.tsx
 * -------------------------------------------------------------
 * Clean, beginner-friendly Login Page for the portal.
 *
 * Rules:
 * 1. If an admin Gmail is given (e.g., admin@gmail.com), logs in as Admin
 *    and redirects directly to the Admin Dashboard (/admin).
 * 2. If a regular user Gmail is given (e.g., user@gmail.com), logs in as User
 *    and redirects directly to the User Dashboard (/user-dashboard).
 * 3. Includes 1-click demo buttons for instant testing.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemoUser, loginAsDemoAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form submit handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address (e.g. admin@gmail.com or user@gmail.com).');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user-dashboard');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login as Admin
  const handleQuickAdmin = async () => {
    setLoading(true);
    try {
      await loginAsDemoAdmin();
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login as User
  const handleQuickUser = async () => {
    setLoading(true);
    try {
      await loginAsDemoUser();
      navigate('/user-dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Box Header */}
      <div className="bg-white border border-gray-300 rounded shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 text-white rounded mx-auto flex items-center justify-center font-bold text-xl mb-3">
            SR
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Portal Login</h1>
          <p className="text-xs text-gray-600 mt-1">
            Sign in to access the Admin Panel or User Dashboard.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address (Gmail) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@gmail.com or user@gmail.com"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Enter an email containing <code className="bg-gray-100 px-1 font-bold">admin</code> for Admin access, or any user Gmail for Citizen access.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (e.g. 123456)"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick 1-Click Demo Logins */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2.5 text-center">
            Or Click for 1-Click Quick Demo Login:
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleQuickAdmin}
              disabled={loading}
              className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold rounded border border-red-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🛡️</span>
              <span>Login as Admin (admin@gmail.com) &rarr;</span>
            </button>

            <button
              type="button"
              onClick={handleQuickUser}
              disabled={loading}
              className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded border border-blue-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>👤</span>
              <span>Login as Citizen User (user@gmail.com) &rarr;</span>
            </button>
          </div>
        </div>

        {/* Helper Note for Examiners/Students */}
        <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded text-[11px] text-gray-600">
          <strong>Role Detection Guide:</strong>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li><span className="font-semibold text-gray-800">admin@gmail.com</span>: Opens the Admin Panel with report moderation controls.</li>
            <li><span className="font-semibold text-gray-800">user@gmail.com</span>: Opens the User Dashboard to track reports.</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-blue-600 hover:underline">
            &larr; Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

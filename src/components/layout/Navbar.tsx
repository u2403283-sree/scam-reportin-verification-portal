import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

/**
 * Navbar.tsx
 * Simple, clean navigation header.
 * Shows authentication state (Admin vs User), Login button, and Logout.
 */
export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report Scam', path: '/report' },
    { name: 'Check Report', path: '/check' },
    { name: 'Public Reports', path: '/reports' },
    { name: 'Awareness', path: '/awareness' },
    { name: 'About', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Website Title */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Scam Reporting &amp; Verification Portal
              </h1>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-2.5 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* If Authenticated: show User Dashboard or Admin Panel */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ${
                      isActive('/admin')
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-300'
                    }`}
                  >
                    <span>🛡️</span>
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/user-dashboard"
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ${
                      isActive('/user-dashboard')
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300'
                    }`}
                  >
                    <span>👤</span>
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* User email badge */}
                <span className="text-[11px] text-gray-500 font-mono hidden lg:inline max-w-[120px] truncate" title={user?.email}>
                  {user?.email}
                </span>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-red-700 hover:bg-red-50 border border-gray-300 rounded cursor-pointer"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* If Not Authenticated: Show Login and Admin direct link */
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                <Link
                  to="/admin"
                  className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded flex items-center gap-1"
                >
                  <span>🛡️</span>
                  <span>Admin</span>
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="text-xs text-gray-500">
                    Logged in as: <strong className="text-gray-800">{user?.email}</strong> ({user?.role})
                  </div>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 px-3 text-xs font-bold text-white bg-red-600 rounded"
                    >
                      🛡️ Open Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to="/user-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 px-3 text-xs font-bold text-white bg-blue-600 rounded"
                    >
                      👤 Open User Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-medium text-white bg-blue-600 rounded"
                  >
                    Login
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded"
                  >
                    🛡️ Admin
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

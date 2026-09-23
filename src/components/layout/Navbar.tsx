import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  FilePlus2,
  FileText,
  BookOpen,
  Info,
  Bell,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, switchRole, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Verify', path: '/verify' },
    { name: 'Report a Scam', path: '/report' },
    { name: 'Scam Reports', path: '/reports' },
    { name: 'Safety Center', path: '/safety' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative p-2 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-400 group-hover:border-sky-400 transition-colors shadow-sm shadow-sky-950">
              <ShieldAlert className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-extrabold tracking-wider text-white">
                  SCAM<span className="text-sky-400">SHIELD</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 text-sky-300 bg-sky-950/80 border border-sky-800/50 rounded">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Report. Verify. Stay Safe.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-sky-400 bg-sky-950/60 border border-sky-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher helper */}
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
              <span className="font-mono text-[10px] text-slate-400">DEMO:</span>
              <button
                onClick={() => {
                  if (user?.role === 'user') return;
                  switchRole('user');
                }}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'user'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'hover:text-slate-200'
                }`}
              >
                User
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => {
                  if (user?.role === 'admin') return;
                  switchRole('admin');
                }}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                        {notifications.length}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-500">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`py-3 px-2 rounded-lg transition-colors cursor-pointer ${
                            n.readStatus ? 'opacity-60 hover:opacity-90' : 'bg-slate-800/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-semibold text-slate-200">{n.title}</h5>
                            {!n.readStatus && (
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-snug">{n.message}</p>
                          {n.reportId && (
                            <Link
                              to={`/reports/${n.reportId}`}
                              className="inline-block mt-1.5 text-[11px] font-mono text-sky-400 hover:underline"
                            >
                              View Report #{n.reportId} →
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login/Register */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md bg-sky-600/30 border border-sky-500/50 flex items-center justify-center text-sky-300 font-mono text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-slate-200 truncate max-w-[100px] leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-mono leading-tight">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-sky-400" />
                        User Dashboard
                      </Link>
                      <Link
                        to="/my-reports"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <FileText className="w-4 h-4 text-sky-400" />
                        My Reports
                      </Link>
                      {isAdmin && (
                        <>
                          <div className="my-1 border-t border-slate-800/80" />
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs text-purple-300 hover:text-white hover:bg-purple-950/40 rounded-md transition-colors"
                          >
                            <Shield className="w-4 h-4 text-purple-400" />
                            Admin Moderation
                          </Link>
                          <Link
                            to="/admin/analytics"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs text-purple-300 hover:text-white hover:bg-purple-950/40 rounded-md transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                            Security Analytics
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-sm shadow-sky-600/30"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.path)
                  ? 'text-sky-400 bg-sky-950/60 border border-sky-800/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated && (
            <div className="pt-3 border-t border-slate-800 space-y-1">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900"
              >
                Dashboard
              </Link>
              <Link
                to="/my-reports"
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900"
              >
                My Reports
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-purple-400 hover:bg-slate-900"
                  >
                    Admin Moderation
                  </Link>
                  <Link
                    to="/admin/analytics"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-purple-400 hover:bg-slate-900"
                  >
                    Admin Analytics
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Quick Demo Switch in mobile */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Demo Switcher:</span>
            <div className="flex gap-2">
              <button
                onClick={() => switchRole('user')}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400"
              >
                User View
              </button>
              <button
                onClick={() => switchRole('admin')}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-purple-400"
              >
                Admin View
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSimpleStats } from '../services/simpleReportService.ts';

/**
 * HomePage.tsx
 * -------------------------------------------------------------------------
 * Home Page for the Scam Reporting & Verification Portal.
 * Clearly presents both:
 * 1. User Side (Citizen Reporting, Search, Dashboard)
 * 2. Admin Side (Reviewing, Moderation, Status Updates)
 */
export const HomePage: React.FC = () => {
  const [stats, setStats] = useState({
    totalSubmitted: 6,
    totalReviewed: 4,
    totalUnderReview: 2,
    totalRejected: 0,
    scamTypesCount: 7,
  });

  useEffect(() => {
    setStats(getSimpleStats());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Box */}
      <section className="bg-white border border-gray-300 rounded p-6 sm:p-10 text-center shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Scam Reporting &amp; Verification Portal
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          A simple platform to report suspected scams and check reported information.
        </p>

        {/* Two Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/report"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-center transition-colors"
          >
            Report a Scam
          </Link>
          <Link
            to="/check"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium border border-gray-300 rounded text-center transition-colors"
          >
            Check a Report
          </Link>
        </div>
      </section>

      {/* Clear Distinction: User Side vs Admin Side */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* User Side Box */}
        <div className="bg-white border border-blue-200 rounded p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-300">
              CITIZEN PORTAL
            </span>
            <span className="text-xl">👤</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">User Side</h2>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Designed for regular users and victims to lodge complaints and check unknown contacts before making payments.
          </p>
          <ul className="text-xs text-gray-700 space-y-1.5 mb-5 list-disc list-inside">
            <li>Submit scam report (no financial data needed)</li>
            <li>Instant search for phone, email, or domain</li>
            <li>Track status of submitted reports</li>
            <li>Read basic cyber fraud awareness tips</li>
          </ul>
          <div className="flex gap-2">
            <Link
              to="/user-dashboard"
              className="flex-1 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors"
            >
              Open User Dashboard &rarr;
            </Link>
            <Link
              to="/report"
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs rounded border border-gray-300 transition-colors"
            >
              File Report
            </Link>
          </div>
        </div>

        {/* Admin Side Box */}
        <div className="bg-white border border-red-200 rounded p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300">
              ADMIN CONTROL
            </span>
            <span className="text-xl">🛡️</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Admin Side</h2>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Designed for authorized investigators or teachers to review incoming complaints, moderate, and update report statuses.
          </p>
          <ul className="text-xs text-gray-700 space-y-1.5 mb-5 list-disc list-inside">
            <li>View all submitted complaints with reporter contacts</li>
            <li>Change status: <em>Under Review &rarr; Reviewed / Rejected</em></li>
            <li>Delete spam or duplicate complaints</li>
            <li>Monitor portal statistics in real-time</li>
          </ul>
          <Link
            to="/admin"
            className="block text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded transition-colors"
          >
            Open Admin Control Panel &rarr;
          </Link>
        </div>
      </section>

      {/* What can you report */}
      <section className="bg-white border border-gray-300 rounded p-6 mt-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          What can you report?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Report suspicious phone numbers, email addresses, websites, or messages.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <span className="font-semibold text-gray-900 block mb-1">📞 Suspicious Phone Numbers</span>
            Fraudulent callers claiming to be bank executives, lottery agents, or customer support.
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <span className="font-semibold text-gray-900 block mb-1">✉️ Phishing Emails</span>
            Fake job offers, income tax refund alerts, or password reset threats.
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <span className="font-semibold text-gray-900 block mb-1">🌐 Fraudulent Websites</span>
            Fake e-commerce portals offering unrealistic discounts or stealing credentials.
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <span className="font-semibold text-gray-900 block mb-1">💬 Social Media Scams</span>
            Suspicious Instagram/Telegram investment schemes and fake giveaways.
          </div>
        </div>
      </section>

      {/* Simple Statistics Section */}
      <section className="bg-white border border-gray-300 rounded p-6 mt-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Portal Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 border border-gray-200 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-blue-600">{stats.totalSubmitted}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">Reports Submitted</p>
          </div>
          <div className="p-4 border border-gray-200 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-green-600">{stats.totalReviewed}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">Reports Reviewed</p>
          </div>
          <div className="p-4 border border-gray-200 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-800">{stats.scamTypesCount}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">Scam Types</p>
          </div>
        </div>
      </section>

      {/* Navigation Quick Links */}
      <section className="mt-6 flex flex-wrap items-center justify-between text-sm text-gray-600 px-1">
        <span>Need to verify an unknown contact?</span>
        <div className="space-x-3">
          <Link to="/reports" className="text-blue-600 hover:underline">
            View All Reports &rarr;
          </Link>
          <Link to="/awareness" className="text-blue-600 hover:underline">
            Read Scam Awareness &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

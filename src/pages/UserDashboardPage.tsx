import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllReports, SimpleReport } from '../services/simpleReportService.ts';

/**
 * UserDashboardPage.tsx
 * -------------------------------------------------------------
 * User Side for the Scam Reporting & Verification Portal.
 * Shows:
 * 1. User actions (Submit report, check phone/email, browse reports)
 * 2. Status of reports submitted by the citizen.
 * 3. Simple, beginner-friendly layout.
 */
export const UserDashboardPage: React.FC = () => {
  const [reports, setReports] = useState<SimpleReport[]>([]);

  useEffect(() => {
    // Show all reports or community reports
    setReports(getAllReports());
  }, []);

  const underReviewCount = reports.filter((r) => r.status === 'Under Review').length;
  const reviewedCount = reports.filter((r) => r.status === 'Reviewed').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* User Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-300 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded border border-blue-300">
              CITIZEN / USER PORTAL
            </span>
            <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Track your submitted scam reports, check suspicious contacts, and learn safe cyber practices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors"
          >
            + File a New Report
          </Link>
          <Link
            to="/admin"
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs rounded border border-gray-300 transition-colors"
          >
            🛡️ Switch to Admin Side &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/report"
          className="bg-white border border-gray-300 hover:border-blue-500 rounded p-5 shadow-sm block transition-all group"
        >
          <span className="text-2xl block mb-2">📝</span>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 text-base">
            Report a Scam
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Submit details of suspicious phone calls, fraud emails, or fake websites.
          </p>
        </Link>

        <Link
          to="/check"
          className="bg-white border border-gray-300 hover:border-blue-500 rounded p-5 shadow-sm block transition-all group"
        >
          <span className="text-2xl block mb-2">🔍</span>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 text-base">
            Check an Identifier
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Verify whether a phone number, email address, or website has been reported.
          </p>
        </Link>

        <Link
          to="/reports"
          className="bg-white border border-gray-300 hover:border-blue-500 rounded p-5 shadow-sm block transition-all group"
        >
          <span className="text-2xl block mb-2">📋</span>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 text-base">
            Browse All Reports
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            View public records of reported incidents across India and worldwide.
          </p>
        </Link>
      </div>

      {/* Overview Statistics */}
      <div className="bg-white border border-gray-300 rounded p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Your Report Tracking Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="text-xl font-bold text-blue-600">{reports.length}</p>
            <p className="text-xs text-gray-600 mt-0.5">Total Community Reports</p>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="text-xl font-bold text-yellow-600">{underReviewCount}</p>
            <p className="text-xs text-gray-600 mt-0.5">Pending Investigation</p>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="text-xl font-bold text-green-600">{reviewedCount}</p>
            <p className="text-xs text-gray-600 mt-0.5">Verified &amp; Reviewed</p>
          </div>
        </div>
      </div>

      {/* Submitted Reports Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            Recent Reports Status
          </h2>
          <span className="text-xs text-gray-500">Live community database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs font-semibold">
                <th className="p-3 border-r border-gray-200">ID</th>
                <th className="p-3 border-r border-gray-200">Type</th>
                <th className="p-3 border-r border-gray-200">Reported Info</th>
                <th className="p-3 border-r border-gray-200">Subject</th>
                <th className="p-3 text-center">Review Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 5).map((report) => (
                <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-blue-700 border-r border-gray-200">
                    {report.id}
                  </td>
                  <td className="p-3 text-gray-800 border-r border-gray-200 text-xs">
                    {report.scamType}
                  </td>
                  <td className="p-3 font-mono text-gray-900 border-r border-gray-200 text-xs">
                    {report.reportedInfo}
                  </td>
                  <td className="p-3 text-gray-700 border-r border-gray-200 text-xs">
                    {report.subject}
                  </td>
                  <td className="p-3 text-center">
                    {report.status === 'Reviewed' ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded border border-green-300">
                        Reviewed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded border border-yellow-300">
                        Under Review
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-right">
          <Link to="/reports" className="text-blue-600 hover:underline font-medium">
            View Full Table with all records &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

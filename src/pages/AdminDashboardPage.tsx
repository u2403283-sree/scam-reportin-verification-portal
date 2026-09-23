import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllReports,
  updateReportStatus,
  deleteReport,
  getSimpleStats,
  SimpleReport,
  SCAM_TYPES,
} from '../services/simpleReportService.ts';

/**
 * AdminDashboardPage.tsx
 * -------------------------------------------------------------
 * Admin Side for the Scam Reporting & Verification Portal.
 * Allows administrators to:
 * 1. View all submitted reports with full reporter details.
 * 2. Moderate and change report status (Under Review, Reviewed, Rejected).
 * 3. Delete inappropriate or test entries.
 * 4. Filter by status or category.
 */
export const AdminDashboardPage: React.FC = () => {
  const [reports, setReports] = useState<SimpleReport[]>([]);
  const [stats, setStats] = useState(getSimpleStats());
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    setReports(getAllReports());
    setStats(getSimpleStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (id: string, newStatus: 'Under Review' | 'Reviewed' | 'Rejected') => {
    const success = updateReportStatus(id, newStatus);
    if (success) {
      loadData();
      setNotification(`Report ${id} status updated to "${newStatus}".`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete report ${id}?`)) {
      deleteReport(id);
      loadData();
      setNotification(`Report ${id} has been deleted.`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.reportedInfo.toLowerCase().includes(q) ||
      r.reporterEmail.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-300 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded border border-red-300">
              ADMINISTRATOR
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Review community reports, verify reported details, and update moderation status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/user-dashboard"
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-300"
          >
            Go to User Dashboard &rarr;
          </Link>
          <Link
            to="/report"
            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
          >
            + New Report
          </Link>
        </div>
      </div>

      {/* Admin Notifications */}
      {notification && (
        <div className="mb-6 p-3 bg-green-50 border border-green-300 text-green-800 text-sm rounded flex items-center justify-between">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-green-700 font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Admin Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.totalSubmitted}</p>
          <p className="text-xs text-gray-600 mt-1">Total Reports</p>
        </div>
        <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{stats.totalUnderReview}</p>
          <p className="text-xs text-gray-600 mt-1">Under Review</p>
        </div>
        <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.totalReviewed}</p>
          <p className="text-xs text-gray-600 mt-1">Reviewed / Verified</p>
        </div>
        <div className="bg-white border border-gray-300 rounded p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-600">{stats.totalRejected}</p>
          <p className="text-xs text-gray-600 mt-1">Rejected</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-300 rounded p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Search Reports:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, email, or number..."
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Status Filter:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Statuses ({reports.length})</option>
            <option value="Under Review">Under Review</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Admin Reports Table with Moderation Actions */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 font-semibold text-xs">
              <th className="p-3 border-r border-gray-200">ID &amp; Date</th>
              <th className="p-3 border-r border-gray-200">Reporter Info</th>
              <th className="p-3 border-r border-gray-200">Reported Scam Data</th>
              <th className="p-3 border-r border-gray-200">Current Status</th>
              <th className="p-3 text-center w-52">Admin Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* ID & Date */}
                  <td className="p-3 border-r border-gray-200 align-top">
                    <span className="font-mono font-bold text-blue-700 block">{report.id}</span>
                    <span className="text-[11px] text-gray-500">{report.createdAt}</span>
                  </td>

                  {/* Reporter Info */}
                  <td className="p-3 border-r border-gray-200 align-top text-xs">
                    <p className="font-semibold text-gray-900">{report.reporterName}</p>
                    <p className="text-gray-600">{report.reporterEmail}</p>
                    <p className="text-gray-500 font-mono">{report.reporterPhone}</p>
                  </td>

                  {/* Reported Scam Data */}
                  <td className="p-3 border-r border-gray-200 align-top text-xs">
                    <span className="font-semibold text-gray-900 block">{report.scamType}</span>
                    <span className="font-mono text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300 inline-block my-1 break-all">
                      {report.reportedInfo}
                    </span>
                    <p className="text-gray-600 line-clamp-2 mt-1">{report.description}</p>
                  </td>

                  {/* Current Status */}
                  <td className="p-3 border-r border-gray-200 align-top">
                    {report.status === 'Reviewed' && (
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                        Reviewed
                      </span>
                    )}
                    {report.status === 'Under Review' && (
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
                        Under Review
                      </span>
                    )}
                    {report.status === 'Rejected' && (
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800 border border-red-300">
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Action Controls */}
                  <td className="p-3 align-top text-center space-y-1.5">
                    <div className="flex flex-col gap-1">
                      {report.status !== 'Reviewed' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'Reviewed')}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Approve / Mark Reviewed
                        </button>
                      )}
                      {report.status !== 'Under Review' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'Under Review')}
                          className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded transition-colors"
                        >
                          Set Under Review
                        </button>
                      )}
                      {report.status !== 'Rejected' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'Rejected')}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded border border-gray-300 transition-colors"
                        >
                          Mark Rejected
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="px-2 py-0.5 text-red-600 hover:text-red-800 text-xs font-medium hover:underline text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No reports match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

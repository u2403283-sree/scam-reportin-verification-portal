import React, { useState, useEffect } from 'react';
import { getAllReports, SimpleReport, SCAM_TYPES } from '../services/simpleReportService.ts';

/**
 * ReportsPage.tsx
 * -------------------------------------------------------------
 * Displays submitted reports in a clean, standard HTML table.
 * Columns:
 * 1. ID
 * 2. Type (Scam Category)
 * 3. Reported Information (Phone / Email / Website)
 * 4. Description
 * 5. Status
 *
 * Includes simple search and type filter for teacher demonstration.
 */
export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<SimpleReport[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Load all reports on mount
  useEffect(() => {
    setReports(getAllReports());
  }, []);

  // Filter reports based on user search and dropdown
  const filteredReports = reports.filter((r) => {
    const matchesType = filterType === 'All' || r.scamType === filterType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.reportedInfo.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submitted Scam Reports</h1>
        <p className="text-sm text-gray-600 mt-1">
          List of community submitted scam incidents for public awareness and verification.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-300 rounded p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Search Reports:
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, or number..."
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Filter by Scam Type:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Types ({reports.length})</option>
            {SCAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Standard HTML Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 font-semibold">
              <th className="p-3 border-r border-gray-200 w-24">ID</th>
              <th className="p-3 border-r border-gray-200 w-44">Type</th>
              <th className="p-3 border-r border-gray-200 w-52">Reported Information</th>
              <th className="p-3 border-r border-gray-200">Description</th>
              <th className="p-3 w-32 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* ID */}
                  <td className="p-3 font-mono font-semibold text-blue-700 border-r border-gray-200 align-top">
                    {report.id}
                  </td>

                  {/* Type */}
                  <td className="p-3 text-gray-800 border-r border-gray-200 align-top">
                    <span className="font-medium">{report.scamType}</span>
                    <span className="block text-xs text-gray-400 capitalize">{report.infoType}</span>
                  </td>

                  {/* Reported Information */}
                  <td className="p-3 font-mono text-gray-900 border-r border-gray-200 align-top">
                    <span className="bg-gray-100 px-2 py-1 rounded border border-gray-300 inline-block break-all">
                      {report.reportedInfo}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="p-3 text-gray-700 border-r border-gray-200 align-top">
                    <strong className="block text-gray-900 mb-0.5">{report.subject}</strong>
                    <p className="text-xs text-gray-600 leading-relaxed">{report.description}</p>
                  </td>

                  {/* Status */}
                  <td className="p-3 text-center align-top">
                    {report.status === 'Reviewed' ? (
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                        Reviewed
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
                        Under Review
                      </span>
                    )}
                    <span className="block text-[11px] text-gray-400 mt-1">{report.createdAt}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No scam reports found matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing {filteredReports.length} of {reports.length} reports</span>
        <span>Data stored in LocalStorage for demonstration</span>
      </div>
    </div>
  );
};

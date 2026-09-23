import React, { useState } from 'react';
import { checkReport, CheckResult } from '../services/simpleReportService.ts';

/**
 * CheckReportPage.tsx
 * -------------------------------------------------------------
 * A simple search tool to check if a phone number, email address,
 * or website has already been reported.
 *
 * Results shown:
 * - "Reported" (if found) or "Not Found"
 * - Type, identifier value, number of reports, short description, and status.
 *
 * No complex AI or risk scoring algorithms.
 */
export const CheckReportPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<CheckResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const result = checkReport(searchInput);
    setSearchResult(result);
    setHasSearched(true);
  };

  // Helper to quickly fill the search box for demonstration
  const handleQuickTest = (sampleValue: string) => {
    setSearchInput(sampleValue);
    const result = checkReport(sampleValue);
    setSearchResult(result);
    setHasSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check a Report</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter a phone number, email address, or website to verify whether it has been reported.
        </p>
      </div>

      {/* Search Box Form */}
      <form onSubmit={handleSearch} className="bg-white border border-gray-300 rounded p-6 shadow-sm mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Search Identifier
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter phone number, email, or website (e.g. 9876543210)"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
          >
            Check
          </button>
        </div>

        {/* Quick Test Samples for Demonstration / Viva */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            Click to test sample data:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickTest('9876543210')}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded border border-gray-300"
            >
              📞 9876543210 (Reported Phone)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest('hr@google-careers-india.org')}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded border border-gray-300"
            >
              ✉️ hr@google-careers-india.org (Reported Email)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest('amazn-discount-store.shop')}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded border border-gray-300"
            >
              🌐 amazn-discount-store.shop (Reported Website)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest('support@legitimate-bank.com')}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded border border-gray-300"
            >
              ✅ Clean Address (Not Found)
            </button>
          </div>
        </div>
      </form>

      {/* Results Section */}
      {hasSearched && searchResult && (
        <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Verification Result
            </h2>
            {/* Status Badge: Reported or Not Found */}
            {searchResult.isFound ? (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded border border-red-300">
                REPORTED
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded border border-green-300">
                NOT FOUND
              </span>
            )}
          </div>

          {searchResult.isFound ? (
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-900">
                <strong>Warning:</strong> This identifier has been reported in our scam database. Exercise extreme caution.
              </div>

              {/* Matched Reports List */}
              <div className="space-y-3">
                {searchResult.matchedReports.map((report) => (
                  <div key={report.id} className="p-4 border border-gray-200 rounded bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-500 font-medium">Type: </span>
                        <span className="font-semibold text-gray-800 capitalize">
                          {report.infoType} ({report.scamType})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Reported Info: </span>
                        <span className="font-mono text-gray-900 font-bold">{report.reportedInfo}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Total Reports: </span>
                        <span className="text-gray-800">{searchResult.totalReports} report(s)</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Status: </span>
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
                          {report.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-500 font-medium block">Short Description:</span>
                      <p className="text-gray-800 mt-1">{report.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded text-sm text-green-900">
              <p className="font-semibold text-base mb-1">No reports found for "{searchResult.query}"</p>
              <p className="text-sm text-green-800">
                This information does not currently match any submitted scam reports in our database. However, always exercise normal caution before transferring money or sharing credentials.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus2, Search, ArrowLeft, Filter, FileText } from 'lucide-react';
import { api } from '../services/api.ts';
import { Report } from '../types/index.ts';
import { ReportTable } from '../components/reports/ReportTable.tsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getMyReports();
        setReports(data);
        setFilteredReports(data);
      } catch (e) {
        console.error('Failed to load my reports', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let list = [...reports];
    if (statusFilter !== 'all') {
      list = list.filter((r) => r.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.reportId.toLowerCase().includes(q) ||
          r.categoryName?.toLowerCase().includes(q)
      );
    }
    setFilteredReports(list);
  }, [statusFilter, searchQuery, reports]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/dashboard"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Submitted Scam Reports</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track investigations, check review remarks, and monitor community confirmations for your submissions.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-sm shadow-sky-600/30 shrink-0 self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Report New Scam</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, ID..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'Submitted', 'Under Review', 'Verified', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingSpinner label="Retrieving your case files..." />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          title="No Matching Reports"
          description="No incident reports match your current filter criteria."
          actionText="File a New Report"
          onAction={() => (window.location.href = '/report')}
        />
      ) : (
        <ReportTable reports={filteredReports} />
      )}
    </div>
  );
};

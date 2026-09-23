import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Calendar, FileText, ArrowRight, X } from 'lucide-react';
import { api } from '../services/api.ts';
import { Report, Category } from '../types/index.ts';

export const ScamReportsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('type') || 'all');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadCats();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.getReports({
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        limit: 50,
      });

      let list = res.reports;
      if (sortOrder === 'oldest') {
        list = [...list].sort((a, b) => new Date(a.incidentDate).getTime() - new Date(b.incidentDate).getTime());
      } else {
        list = [...list].sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime());
      }

      setReports(list);
      setTotal(list.length);
    } catch (err) {
      console.error('Failed to load scam reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedCategory, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortOrder('recent');
  };

  const getPrimaryIdentifier = (report: Report): string => {
    if (!report.identifiers || report.identifiers.length === 0) return 'Not specified';
    const first = report.identifiers[0];
    const typeLabel = first.type === 'phone' ? 'Phone' : first.type === 'email' ? 'Email' : first.type === 'url' ? 'Website' : 'Identifier';
    return `${typeLabel}: ${first.maskedValue || first.value}`;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Scam Reports</h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Browse reports submitted by users.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-8 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Scam Types</option>
              <option value="4">Online Shopping</option>
              <option value="2">Job Scam</option>
              <option value="3">Investment Scam</option>
              <option value="5">Phishing</option>
              <option value="6">Social Media Scam</option>
              <option value="7">Fake Customer Support</option>
              <option value="8">Lottery / Prize</option>
              <option value="1">Other</option>
            </select>

            {/* Date Sorting */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'recent' | 'oldest')}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Newest Date First</option>
              <option value="oldest">Oldest Date First</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>

            {(searchTerm || selectedCategory !== 'all' || sortOrder !== 'recent') && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        <div className="text-xs text-slate-500 pt-1">
          Showing <strong>{reports.length}</strong> report{reports.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-lg border border-slate-200 text-center text-slate-500 text-sm">
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-slate-200 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No reports found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or scam type filter.
          </p>
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-blue-600 hover:underline pt-2"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Header: ID & Scam Type */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-600">
                    {report.reportId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    {report.categoryName || 'Scam Report'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-1">
                  {report.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  "{report.description}"
                </p>

                {/* Reported Identifier */}
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100 mb-4">
                  <span className="text-xs font-medium text-slate-700">
                    {getPrimaryIdentifier(report)}
                  </span>
                </div>
              </div>

              {/* Footer: Date & View Details */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {report.incidentDate}
                </span>

                <Link
                  to={`/reports/${report.id}`}
                  className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

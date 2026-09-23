import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  FileEdit,
  TrendingUp,
  BarChart3,
  UserCheck,
  Shield
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Report, ReportStatus, RiskLevel } from '../types/index.ts';
import { StatCard } from '../components/ui/StatCard.tsx';
import { RiskBadge } from '../components/ui/RiskBadge.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.tsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, switchRole } = useAuth();
  const { showToast } = useToast();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected report for review modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ReportStatus>('Verified');
  const [reviewRisk, setReviewRisk] = useState<RiskLevel>('high');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const reps = await api.getAdminReports();
      setReports(reps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openReviewModal = (report: Report) => {
    setSelectedReport(report);
    setReviewStatus(report.status === 'Submitted' ? 'Verified' : report.status);
    setReviewRisk(report.riskLevel);
    setReviewComment(
      report.status === 'Submitted'
        ? 'Cross-verified against community reports and banking indicators.'
        : ''
    );
  };

  const handleReviewSubmit = async () => {
    if (!selectedReport) return;
    setIsSubmittingReview(true);
    try {
      await api.reviewReport(selectedReport.id, {
        action: reviewStatus === 'Verified' ? 'approve' : reviewStatus === 'Rejected' ? 'reject' : 'request_info',
        status: reviewStatus,
        riskLevel: reviewRisk,
        comment: reviewComment.trim() || 'Status updated by cybersecurity admin.',
      });

      showToast(`Report #${selectedReport.reportId} successfully updated`, 'success');
      setSelectedReport(null);
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update review status', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus !== 'all' && r.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.reportId.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.categoryName?.toLowerCase().includes(q) ||
        r.reporterEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalReports = reports.length;
  const pendingReviews = reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
  const verifiedCount = reports.filter((r) => r.status === 'Verified').length;
  const highRiskCount = reports.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-900/60 bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-900 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-purple-900/80 text-purple-300 border border-purple-700">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                Cybersecurity Moderation Portal
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                ROLE: ADMIN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Incident Moderation & Audit Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Review crowdsourced incident cases, adjust algorithmic threat ratings, and manage public safety feeds.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/analytics"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-purple-600/30"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Security Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={totalReports}
          subtitle="All filed cases"
          icon={ShieldAlert}
          color="purple"
        />
        <StatCard
          title="Pending Action"
          value={pendingReviews}
          subtitle="Awaiting moderation approval"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Verified Scams"
          value={verifiedCount}
          subtitle="Audited and confirmed"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="High / Critical"
          value={highRiskCount}
          subtitle="Flagged high-risk syndicates"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Moderation Queue Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Incident Moderation Queue</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {filteredReports.length} Reports
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, email, title..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Newly Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Additional Information Required">Info Required</option>
            </select>
          </div>
        </div>

        {/* Table of Reports */}
        {loading ? (
          <LoadingSpinner label="Loading admin security dossier..." />
        ) : filteredReports.length === 0 ? (
          <div className="glass-panel p-10 text-center rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">No reports match your current admin filter.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3">Report ID</th>
                  <th scope="col" className="px-4 py-3">Reporter</th>
                  <th scope="col" className="px-4 py-3">Incident & Category</th>
                  <th scope="col" className="px-4 py-3">Identifiers</th>
                  <th scope="col" className="px-4 py-3">Risk</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs font-bold text-sky-400">
                      <Link to={`/reports/${report.reportId}`} className="hover:underline">
                        #{report.reportId}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                      <p className="text-white font-medium">{report.reporterName}</p>
                      <p className="text-slate-400 font-mono text-[11px] truncate max-w-[150px]">
                        {report.reporterEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="max-w-xs">
                        <span className="text-[10px] font-mono text-purple-400 uppercase block">
                          {report.categoryName}
                        </span>
                        <p className="text-xs font-semibold text-white truncate">{report.title}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{report.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs">
                      {report.identifiers.map((ident, i) => (
                        <span key={i} className="block text-slate-300">
                          <strong className="text-slate-400 uppercase text-[10px] mr-1">
                            {ident.type}:
                          </strong>
                          {ident.maskedValue}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <RiskBadge level={report.riskLevel} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openReviewModal(report)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Moderation Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Audit & Moderate Incident #${selectedReport.reportId}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Report Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{selectedReport.title}</span>
                <RiskBadge level={selectedReport.riskLevel} />
              </div>
              <p className="text-slate-300 leading-relaxed">{selectedReport.description}</p>
              <div className="flex flex-wrap gap-4 pt-2 text-slate-400 text-[11px] font-mono">
                <span>Loss: ₹{selectedReport.amountLost.toLocaleString('en-IN')}</span>
                <span>Date: {selectedReport.incidentDate}</span>
                <span>Location: {selectedReport.city}, {selectedReport.state}</span>
              </div>
            </div>

            {/* Unmasked Identifier Security Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/50 space-y-2">
              <span className="font-mono text-purple-400 font-bold uppercase block text-[11px]">
                Internal Security Data (Full Unmasked Value):
              </span>
              <div className="space-y-1 font-mono">
                {selectedReport.identifiers.map((ident, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-200">
                    <span>{ident.type.toUpperCase()}: <strong>{ident.value}</strong></span>
                    <span className="text-slate-500">Public: {ident.maskedValue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Status & Risk Level Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Assign Review Status
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as ReportStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Verified">Verified (Confirmed Threat)</option>
                  <option value="Under Review">Under Review (Pending Investigation)</option>
                  <option value="Additional Information Required">Request More Details</option>
                  <option value="Rejected">Rejected (Spam / Insufficient Evidence)</option>
                  <option value="Duplicate">Mark as Duplicate</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Assign Threat Level
                </label>
                <select
                  value={reviewRisk}
                  onChange={(e) => setReviewRisk(e.target.value as RiskLevel)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="critical">Critical Threat</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
            </div>

            {/* Moderation Comment */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Moderator Audit Remarks (Logged in Public Timeline)
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Explain the review decision: verified cross-bank reports, identified bot campaign, etc."
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={isSubmittingReview}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmittingReview ? 'Updating Audit Log...' : 'Apply Moderation Decision'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

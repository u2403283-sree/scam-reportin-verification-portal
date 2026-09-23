import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  Search,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { StatCard } from '../components/ui/StatCard.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { RiskBadge } from '../components/ui/RiskBadge.tsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { api } from '../services/api.ts';
import { Report, VerificationSearchLog } from '../types/index.ts';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [searches, setSearches] = useState<VerificationSearchLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const [reps, sLog] = await Promise.all([
          api.getMyReports(),
          api.getVerificationHistory(),
        ]);
        setMyReports(reps);
        setSearches(sLog);
      } catch (err) {
        console.error('Failed to load user dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [user]);

  const verifiedCount = myReports.filter((r) => r.status === 'Verified').length;
  const pendingCount = myReports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400">
                Citizen Defender Dashboard
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/50">
                {user?.role?.toUpperCase() || 'USER'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Welcome back, {user?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Track your submitted scam cases, review verification lookups, and contribute to network vigilance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/report"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-sky-600/30"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Report a Scam</span>
            </Link>
            <Link
              to="/verify"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span>Verify Identifier</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Reports Submitted"
          value={myReports.length}
          subtitle="Total incidents filed by you"
          icon={FileText}
          color="sky"
        />
        <StatCard
          title="Under Review"
          value={pendingCount}
          subtitle="Queued in moderation audit"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Verified Reports"
          value={verifiedCount}
          subtitle="Cross-validated by security"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Verifications Run"
          value={searches.length}
          subtitle="Identities checked by you"
          icon={Search}
          color="purple"
        />
      </div>

      {/* Grid: My Recent Reports & Verification History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Recent Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>My Incident Reports</span>
            </h3>
            <Link
              to="/my-reports"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading your cases..." />
          ) : myReports.length === 0 ? (
            <EmptyState
              title="No Reports Filed Yet"
              description="You haven't submitted any scam incidents yet. If you received a suspicious call or message, file a report to protect the community."
              actionText="File Your First Report"
              onAction={() => (window.location.href = '/report')}
            />
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
              {myReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        #{report.reportId}
                      </span>
                      <StatusBadge status={report.status} />
                      <RiskBadge level={report.riskLevel} />
                    </div>
                    <Link
                      to={`/reports/${report.reportId}`}
                      className="text-sm font-semibold text-white hover:text-sky-300 transition-colors block line-clamp-1"
                    >
                      {report.title}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {report.categoryName} · Incident Date: {report.incidentDate}
                    </p>
                  </div>

                  <Link
                    to={`/reports/${report.reportId}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-xs font-medium text-slate-300 transition-colors shrink-0 self-start sm:self-auto"
                  >
                    View Timeline →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Searches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              <span>Recent Verifications</span>
            </h3>
            <Link
              to="/verify"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <span>Verify New</span>
            </Link>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            {searches.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No recent searches logged. Try verifying a number on the Verify page.
              </p>
            ) : (
              searches.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {s.identifierType}
                    </span>
                    <span className="font-mono font-bold text-white text-xs truncate max-w-[140px] block">
                      {s.maskedValue}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                      s.resultStatus === 'frequently_reported'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        : s.resultStatus === 'suspicious'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                    }`}
                  >
                    {s.reportsMatched} reports
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

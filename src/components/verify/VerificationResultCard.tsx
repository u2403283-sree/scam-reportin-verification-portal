import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Info,
  Calendar,
  MapPin,
  FilePlus2,
  CheckCircle2
} from 'lucide-react';
import { VerificationResult } from '../../types/index.ts';
import { RiskBadge } from '../ui/RiskBadge.tsx';

interface VerificationResultCardProps {
  result: VerificationResult;
  onReset?: () => void;
}

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ result, onReset }) => {
  const isSafe = result.riskLevel === 'safe' || result.totalReports === 0;
  const isSuspicious = result.riskLevel === 'suspicious' || result.riskLevel === 'low';
  const isHighRisk = result.riskLevel === 'high' || result.riskLevel === 'critical';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      {/* Primary Result Banner */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all relative overflow-hidden shadow-2xl ${
          isSafe
            ? 'bg-gradient-to-b from-emerald-950/30 to-slate-950 border-emerald-500/40 shadow-emerald-950/20'
            : isSuspicious
            ? 'bg-gradient-to-b from-amber-950/30 to-slate-950 border-amber-500/40 shadow-amber-950/20'
            : 'bg-gradient-to-b from-rose-950/40 to-slate-950 border-rose-500/50 shadow-rose-950/30'
        }`}
      >
        {/* Glow corner accent */}
        <div
          className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isSafe ? 'bg-emerald-500' : isSuspicious ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div
              className={`p-3.5 rounded-xl border shrink-0 ${
                isSafe
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : isSuspicious
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {isSafe && <ShieldCheck className="w-8 h-8" />}
              {isSuspicious && <AlertTriangle className="w-8 h-8" />}
              {isHighRisk && <AlertOctagon className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Target Identifier:
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                  {result.maskedIdentifier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono">
                Identifier Type: {result.identifierType.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <RiskBadge level={result.riskLevel} />
          </div>
        </div>

        {/* Status Heading & Description */}
        <div className="mt-6">
          <h3
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isSafe ? 'text-emerald-300' : isSuspicious ? 'text-amber-300' : 'text-rose-300'
            }`}
          >
            {result.statusHeading}
          </h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
            {result.statusDescription}
          </p>
        </div>

        {/* Metrics Overview Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Reports Found</span>
            <p className="text-xl font-bold font-mono text-white mt-1">{result.totalReports}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Risk Level</span>
            <p className="text-xl font-bold uppercase font-mono mt-1 text-sky-400">
              {result.riskLevel}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Associated Categories</span>
            <p className="text-xl font-bold font-mono text-white mt-1">
              {result.categories.length > 0 ? result.categories.length : '0'}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Database Status</span>
            <p className="text-sm font-semibold font-mono text-emerald-400 mt-1">Real-time Synchronized</p>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
              Recommended Protective Action
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{result.recommendedAction}</p>
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <Link
            to={`/report?type=${result.identifierType}&value=${encodeURIComponent(result.rawInput)}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors shadow-sm shadow-sky-600/30"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Report This Identifier</span>
          </Link>

          {onReset && (
            <button
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Verify Another Identifier
            </button>
          )}
        </div>
      </div>

      {/* Categories Breakdown (if any reported) */}
      {result.categories.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Complaint Categories Distribution
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {result.categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                <span className="font-medium">{cat.name}</span>
                <span className="font-mono text-sky-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                  {cat.count} report{cat.count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Community Reports Table / Cards */}
      {result.latestReports.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Recent Community Reports Involving This Identifier
            </h4>
            <Link
              to="/reports"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              Search full database <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.latestReports.map((report) => (
              <Link
                key={report.id}
                to={`/reports/${report.reportId}`}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all group block"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-sky-400 font-semibold">
                    #{report.reportId}
                  </span>
                  <RiskBadge level={report.riskLevel} />
                </div>
                <h5 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors mt-2 line-clamp-1">
                  {report.title}
                </h5>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {report.incidentDate}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {report.city}, {report.state}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong>Security Disclaimer:</strong> {result.disclaimer}
        </p>
      </div>
    </div>
  );
};

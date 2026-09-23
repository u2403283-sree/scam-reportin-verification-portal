import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ThumbsUp, Eye, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Report } from '../../types/index.ts';
import { RiskBadge } from '../ui/RiskBadge.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';

interface ReportCardProps {
  report: Report;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const primaryIdent = report.identifiers[0];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group">
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-sky-400">
              #{report.reportId}
            </span>
            <StatusBadge status={report.status} />
          </div>
          <RiskBadge level={report.riskLevel} />
        </div>

        {/* Category & Title */}
        <div className="mt-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Tag className="w-3.5 h-3.5 text-sky-400" />
            <span>{report.categoryName || 'Scam Report'}</span>
            {report.platform && (
              <>
                <span>·</span>
                <span className="text-slate-400">{report.platform}</span>
              </>
            )}
          </div>
          <Link to={`/reports/${report.reportId}`}>
            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors mt-1.5 line-clamp-2 leading-snug">
              {report.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Masked identifier box */}
        {primaryIdent && (
          <div className="mt-4 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {primaryIdent.type}:
            </span>
            <span className="text-xs font-mono font-bold text-slate-200 truncate">
              {primaryIdent.maskedValue}
            </span>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate max-w-[110px]">{report.city || report.country}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{report.incidentDate}</span>
          </span>
        </div>

        <Link
          to={`/reports/${report.reportId}`}
          className="flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors shrink-0"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

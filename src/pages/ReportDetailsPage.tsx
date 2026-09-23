import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ThumbsUp,
  Eye,
  ShieldAlert,
  ArrowLeft,
  Share2,
  FilePlus2,
  FileText,
  AlertTriangle,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Report } from '../types/index.ts';
import { RiskBadge } from '../components/ui/RiskBadge.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);

  useEffect(() => {
    async function loadReport() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getReportById(id);
        setReport(data);
        setUpvotes(data.communityUpvotes || 1);
      } catch (err) {
        console.error('Failed to load report', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleUpvote = () => {
    if (upvoted) {
      setUpvotes((v) => v - 1);
      setUpvoted(false);
      showToast('Removed confirmation vote.', 'info');
    } else {
      setUpvotes((v) => v + 1);
      setUpvoted(true);
      showToast('Thank you for confirming this incident as helpful.', 'success');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Report URL copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Decrypting and loading incident dossier..." />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <p className="text-sm text-slate-400 mt-2">
          The requested scam report ID may have been removed or does not exist.
        </p>
        <Link
          to="/reports"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Database
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded border border-sky-800/50">
              #{report.reportId}
            </span>
            <StatusBadge status={report.status} />
          </div>
          <RiskBadge level={report.riskLevel} />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            {report.categoryName} · Platform: {report.platform}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
            {report.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Incident Date: {report.incidentDate}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{report.city ? `${report.city}, ${report.state}, ${report.country}` : report.country}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{report.viewsCount || 1} Views</span>
            </span>
          </div>
        </div>

        {/* Masked Identifiers Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Target Scam Identifiers (Masked for Public Privacy)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.identifiers.map((ident) => (
              <div
                key={ident.id}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    {ident.type}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {ident.maskedValue}
                  </span>
                </div>
                <Link
                  to={`/verify?type=${ident.type}&q=${encodeURIComponent(ident.value)}`}
                  className="px-2.5 py-1 rounded bg-sky-950/80 hover:bg-sky-900 text-sky-400 text-[11px] font-mono border border-sky-800/40 shrink-0 transition-colors"
                >
                  Verify →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Incident Narrative & Financial Loss */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Narrative & Modus Operandi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Detailed Incident Narrative</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Key Risk Indicators */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Reported Modus Operandi & Warning Signs</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Urgency tactics employed to bypass normal verification routines.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Requested payment through non-reversible instant channels (Crypto / Gift Cards / Wire Transfer).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Refused formal video verification or official company domain correspondence.</span>
              </li>
            </ul>
          </div>

          {/* Evidence Attachments */}
          {report.evidence && report.evidence.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Submitted Supporting Evidence
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-slate-300 truncate">{ev.fileName}</span>
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      {ev.fileType.split('/')[1] || 'DOC'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Moderation Review Trail */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Verification Audit Trail</span>
            </h3>

            <div className="space-y-4 border-l-2 border-slate-800 pl-4 ml-2">
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-sky-500 border-2 border-slate-950" />
                <p className="text-xs font-semibold text-white">Incident Report Logged</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Timestamp: {report.createdAt}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Incident registered by citizen reporter into decentralized threat intelligence queue.
                </p>
              </div>

              {report.moderationHistory && report.moderationHistory.length > 0 ? (
                report.moderationHistory.map((mod) => (
                  <div key={mod.id} className="relative pt-2">
                    <span className="absolute -left-[23px] top-3 w-3 h-3 rounded-full bg-purple-500 border-2 border-slate-950" />
                    <p className="text-xs font-semibold text-purple-300">
                      Moderation Audit: {mod.action.toUpperCase()}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Reviewed by {mod.adminName} · {mod.createdAt}
                    </p>
                    <p className="text-xs text-slate-300 mt-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      "{mod.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="relative pt-2">
                  <span className="absolute -left-[23px] top-3 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-950" />
                  <p className="text-xs font-semibold text-amber-300">Pending Review</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Queued for human verification and evidence cross-validation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Actions */}
        <div className="space-y-6">
          {/* Financial Loss Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-mono uppercase text-slate-400">Reported Financial Impact</span>
            <div>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {report.amountLost > 0 ? `₹${report.amountLost.toLocaleString('en-IN')}` : 'No Direct Loss Reported'}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {report.amountLost > 0 ? 'Direct funds transferred before recognition' : 'Prevented by alert user'}
              </p>
            </div>
          </div>

          {/* Community Confirmation */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Community Confirmation
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have you encountered this same scammer or message? Confirming helps elevate vigilance scores.
            </p>

            <button
              onClick={handleUpvote}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                upvoted
                  ? 'bg-sky-600 text-white border-sky-500'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-sky-500'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{upvoted ? 'Confirmed by You' : 'Confirm Similar Incident'} ({upvotes})</span>
            </button>
          </div>

          {/* Report Similar CTA */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 bg-gradient-to-b from-slate-900 to-sky-950/30">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Targeted by This Scammer?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit your own interaction to strengthen the community evidentiary dossier against these identifiers.
            </p>
            <Link
              to={`/report?type=${report.identifiers[0]?.type || 'phone'}&value=${encodeURIComponent(
                report.identifiers[0]?.value || ''
              )}`}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Report Related Incident</span>
            </Link>
          </div>

          {/* Legal Notice */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <p>
              <strong>Notice:</strong> This report is crowdsourced information. For official legal investigations or banking fund freezes, immediately dial <strong>1930</strong> or register an FIR at your local cyber cell.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

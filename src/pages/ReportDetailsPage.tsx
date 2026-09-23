import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api.ts';
import { Report } from '../types/index.ts';

export const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getReportById(id);
        setReport(data);
      } catch (err) {
        console.error('Failed to load report', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  // Simplify status to only: Submitted, Under Review, Reviewed
  const getSimpleStatus = (status: string): { label: 'Submitted' | 'Under Review' | 'Reviewed'; colorClass: string } => {
    if (status === 'Verified' || status === 'Reviewed') {
      return { label: 'Reviewed', colorClass: 'bg-green-50 text-green-700 border-green-200' };
    }
    if (status === 'Under Review') {
      return { label: 'Under Review', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { label: 'Submitted', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' };
  };

  if (loading) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-20 text-center text-sm text-slate-500">
        Loading report details...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
        <p className="text-sm text-slate-600 mt-2">
          The requested scam report does not exist or has been removed.
        </p>
        <Link
          to="/reports"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scam Reports</span>
        </Link>
      </div>
    );
  }

  const statusInfo = getSimpleStatus(report.status);

  return (
    <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all reports</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header: ID, Scam Type & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {report.reportId}
            </span>
            <div className="mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {report.categoryName || 'Scam Report'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block mb-1">Status</span>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border ${statusInfo.colorClass}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
            Report Title
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {report.title}
          </h1>
        </div>

        {/* Date of Incident */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Date of Incident: <strong>{report.incidentDate}</strong></span>
        </div>

        {/* Reported Identifier */}
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">
            Reported Identifier Involved
          </span>
          <div className="space-y-2">
            {report.identifiers && report.identifiers.length > 0 ? (
              report.identifiers.map((ident, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-sm"
                >
                  <span className="font-medium text-slate-600 uppercase text-xs">
                    {ident.type === 'phone' ? 'Phone Number' : ident.type === 'email' ? 'Email Address' : ident.type === 'url' ? 'Website URL' : ident.type}
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {ident.maskedValue || ident.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
                No specific identifier provided.
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">
            Incident Description
          </span>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {report.description}
          </div>
        </div>

        {/* Reporter info note */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Submitted by: <strong>{report.reporterName || 'Community Member'}</strong></span>
          <span>Submitted on: {new Date(report.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

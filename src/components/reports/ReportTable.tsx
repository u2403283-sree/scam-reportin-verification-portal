import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowUpDown, Calendar, MapPin } from 'lucide-react';
import { Report } from '../../types/index.ts';
import { RiskBadge } from '../ui/RiskBadge.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';

interface ReportTableProps {
  reports: Report[];
  onView?: (report: Report) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports, onView }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/80 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th scope="col" className="px-4 py-3.5">Report ID</th>
            <th scope="col" className="px-4 py-3.5">Scam Category & Title</th>
            <th scope="col" className="px-4 py-3.5">Target Identifier</th>
            <th scope="col" className="px-4 py-3.5">Incident Date</th>
            <th scope="col" className="px-4 py-3.5">Location</th>
            <th scope="col" className="px-4 py-3.5">Risk Level</th>
            <th scope="col" className="px-4 py-3.5">Status</th>
            <th scope="col" className="px-4 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {reports.map((report) => {
            const ident = report.identifiers[0];
            return (
              <tr
                key={report.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-xs text-sky-400">
                  <Link to={`/reports/${report.reportId}`} className="hover:underline">
                    #{report.reportId}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <div className="max-w-xs">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      {report.categoryName}
                    </p>
                    <Link
                      to={`/reports/${report.reportId}`}
                      className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors line-clamp-1 mt-0.5"
                    >
                      {report.title}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs">
                  {ident ? (
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-mono">
                        {ident.type}
                      </span>
                      <span className="text-slate-200 font-semibold">{ident.maskedValue}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-400 font-mono">
                  {report.incidentDate}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-400">
                  {report.city ? `${report.city}, ${report.state}` : report.country}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <RiskBadge level={report.riskLevel} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                  <Link
                    to={`/reports/${report.reportId}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-sky-600 hover:text-white text-xs font-medium text-slate-300 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

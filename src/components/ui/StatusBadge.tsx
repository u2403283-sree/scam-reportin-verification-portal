import React from 'react';
import { ReportStatus } from '../../types/index.ts';

interface StatusBadgeProps {
  status: ReportStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let textColor = 'text-slate-300';
  let bgColor = 'bg-slate-800/60';
  let borderColor = 'border-slate-700';

  switch (status) {
    case 'Verified':
      textColor = 'text-emerald-300';
      bgColor = 'bg-emerald-950/50';
      borderColor = 'border-emerald-800/60';
      break;
    case 'Under Review':
      textColor = 'text-sky-300';
      bgColor = 'bg-sky-950/50';
      borderColor = 'border-sky-800/60';
      break;
    case 'Additional Information Required':
      textColor = 'text-amber-300';
      bgColor = 'bg-amber-950/50';
      borderColor = 'border-amber-800/60';
      break;
    case 'Rejected':
      textColor = 'text-rose-300';
      bgColor = 'bg-rose-950/50';
      borderColor = 'border-rose-800/60';
      break;
    case 'Duplicate':
      textColor = 'text-purple-300';
      bgColor = 'bg-purple-950/50';
      borderColor = 'border-purple-800/60';
      break;
    case 'Submitted':
    default:
      textColor = 'text-slate-300';
      bgColor = 'bg-slate-900/60';
      borderColor = 'border-slate-700';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-md ${bgColor} ${borderColor} ${textColor} ${className}`}
    >
      {status}
    </span>
  );
};

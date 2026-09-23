import React from 'react';
import { RiskLevel } from '../../types/index.ts';

interface RiskBadgeProps {
  level: RiskLevel | 'safe' | 'suspicious' | string;
  className?: string;
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '', showDot = true }) => {
  const norm = level.toLowerCase();

  let text = 'Medium Risk';
  let textColor = 'text-sky-400';
  let dotColor = 'bg-sky-400';
  let borderColor = 'border-sky-500/30';
  let bgColor = 'bg-sky-500/10';

  if (norm === 'low' || norm === 'safe') {
    text = norm === 'safe' ? 'Low / No Risk Flagged' : 'Low Risk';
    textColor = 'text-emerald-400';
    dotColor = 'bg-emerald-400';
    borderColor = 'border-emerald-500/30';
    bgColor = 'bg-emerald-500/10';
  } else if (norm === 'medium') {
    text = 'Medium Risk';
    textColor = 'text-sky-400';
    dotColor = 'bg-sky-400';
    borderColor = 'border-sky-500/30';
    bgColor = 'bg-sky-500/10';
  } else if (norm === 'high' || norm === 'suspicious') {
    text = norm === 'suspicious' ? 'Suspicious' : 'High Risk';
    textColor = 'text-amber-400';
    dotColor = 'bg-amber-400';
    borderColor = 'border-amber-500/30';
    bgColor = 'bg-amber-500/10';
  } else if (norm === 'critical') {
    text = 'Critical Threat';
    textColor = 'text-rose-400';
    dotColor = 'bg-rose-400';
    borderColor = 'border-rose-500/40';
    bgColor = 'bg-rose-500/10';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-wide uppercase border rounded-md ${bgColor} ${borderColor} ${textColor} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />}
      <span>{text}</span>
    </span>
  );
};

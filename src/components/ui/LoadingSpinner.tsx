import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Scanning Cyber Intelligence Database...',
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
        <div className="relative p-3 rounded-full bg-slate-900 border border-sky-500/40 shadow-lg shadow-sky-500/10">
          <Shield className={`${iconSize} text-sky-400 animate-pulse`} />
        </div>
      </div>
      {label && <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">{label}</p>}
    </div>
  );
};

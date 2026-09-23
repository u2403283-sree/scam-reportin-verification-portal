import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Search, ShieldAlert, History, Filter, ArrowRight } from 'lucide-react';
import { SearchBox } from '../components/verify/SearchBox.tsx';
import { VerificationResultCard } from '../components/verify/VerificationResultCard.tsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { ReportCard } from '../components/reports/ReportCard.tsx';
import { api } from '../services/api.ts';
import { IdentifierType, VerificationResult, VerificationSearchLog, Report } from '../types/index.ts';

export const VerifyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as IdentifierType) || 'phone';
  const initialQuery = searchParams.get('q') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<VerificationSearchLog[]>([]);
  const [recentScams, setRecentScams] = useState<Report[]>([]);

  useEffect(() => {
    async function loadAux() {
      try {
        const [hist, recents] = await Promise.all([
          api.getVerificationHistory(),
          api.getReports({ limit: 4 }),
        ]);
        setSearchHistory(hist);
        setRecentScams(recents.reports);
      } catch (e) {
        console.error('Failed to load aux verify data', e);
      }
    }
    loadAux();

    if (initialQuery) {
      handleSearch(initialType, initialQuery);
    }
  }, []);

  const handleSearch = async (type: IdentifierType, query: string) => {
    setIsLoading(true);
    try {
      const data = await api.verifyIdentifier(type, query);
      setResult(data);
      // update history
      const hist = await api.getVerificationHistory();
      setSearchHistory(hist);
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-400 text-xs font-mono mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Real-Time Database Verification Node</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Verify Before You Trust
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Search our database for previously reported suspicious phone numbers, website URLs, email addresses, bank accounts, and social profiles.
        </p>
      </div>

      {/* Main Search Box Component */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <SearchBox
          onSearch={handleSearch}
          isLoading={isLoading}
          initialType={initialType}
          initialQuery={initialQuery}
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-12">
          <LoadingSpinner label="Querying threat intelligence & matching citizen reports..." />
        </div>
      )}

      {/* Verification Result Card */}
      {!isLoading && result && (
        <VerificationResultCard result={result} onReset={() => setResult(null)} />
      )}

      {/* Verification History Log (Recent checks) */}
      {!result && !isLoading && searchHistory.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              <span>Recent Community Verification Lookups</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Live Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSearch(item.identifierType, item.identifierValue)}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono uppercase text-sky-400">{item.identifierType}</span>
                  <span
                    className={`font-mono px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      item.resultStatus === 'frequently_reported'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        : item.resultStatus === 'suspicious'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                    }`}
                  >
                    {item.resultStatus === 'frequently_reported'
                      ? 'High Risk'
                      : item.resultStatus === 'suspicious'
                      ? 'Suspicious'
                      : 'No Reports'}
                  </span>
                </div>
                <p className="font-mono font-bold text-sm text-white mt-1.5 truncate group-hover:text-sky-300 transition-colors">
                  {item.maskedValue}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Matched {item.reportsMatched} community complaints
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Reports Preview */}
      {!result && !isLoading && recentScams.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Recently Reported Community Incidents
            </h3>
            <span className="text-xs text-slate-400">Audited in the past 48 hours</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentScams.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

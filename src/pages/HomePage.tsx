import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  FilePlus2,
  AlertTriangle,
  Lock,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Landmark,
  ShoppingBag,
  Fish,
  Share2,
  Headphones,
  Award,
  ChevronRight,
  Activity,
  CheckCircle2,
  Users,
  Shield,
  Eye
} from 'lucide-react';
import { SearchBox } from '../components/verify/SearchBox.tsx';
import { VerificationResultCard } from '../components/verify/VerificationResultCard.tsx';
import { ReportCard } from '../components/reports/ReportCard.tsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { api } from '../services/api.ts';
import { Report, VerificationResult, IdentifierType } from '../types/index.ts';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getReports({ limit: 4 });
        setRecentReports(res.reports);
      } catch (err) {
        console.error('Failed to load recent reports', err);
      } finally {
        setLoadingReports(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = async (type: IdentifierType, query: string) => {
    setVerifying(true);
    try {
      const res = await api.verifyIdentifier(type, query);
      setVerificationResult(res);
      // scroll to result
      const el = document.getElementById('verification-result-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Verification failed', err);
    } finally {
      setVerifying(false);
    }
  };

  const categories = [
    { name: 'Banking & Financial', slug: '1', icon: Landmark, count: '312 Reports', desc: 'Fraudulent transfer requests, SIM swap, and APK trojans.' },
    { name: 'Job & Tasks', slug: '2', icon: Briefcase, count: '284 Reports', desc: 'Telegram task schemes, fake work-from-home, registration extortion.' },
    { name: 'Investment & Crypto', slug: '3', icon: TrendingUp, count: '419 Reports', desc: 'Guaranteed 300% profit trading platforms and fake broker apps.' },
    { name: 'Online Shopping', slug: '4', icon: ShoppingBag, count: '198 Reports', desc: 'Fake Instagram luxury clearance shops and ghost delivery tracking.' },
    { name: 'Phishing & Spoofing', slug: '5', icon: Fish, count: '245 Reports', desc: 'Electricity bill warnings, tax portal replicas, and credential traps.' },
    { name: 'Social Media & Sextortion', slug: '6', icon: Share2, count: '136 Reports', desc: 'Compromised friend emergency money requests and catfishing.' },
    { name: 'Fake Customer Care', slug: '7', icon: Headphones, count: '189 Reports', desc: 'Google search sponsored helpline numbers claiming to be airlines/banks.' },
    { name: 'Lottery & Prizes', slug: '8', icon: Award, count: '97 Reports', desc: 'Advance-fee courier delivery customs fees for non-existent awards.' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/80 cyber-radial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Live Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 text-xs font-mono mb-6 shadow-lg shadow-sky-950/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Community Intelligence Portal · Real-Time Threat Feeds</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Know Before <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">You Trust.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report suspicious activity, verify scam-related information, and help others stay safe online. An open community defense network against digital fraud.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/verify"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-all shadow-lg shadow-sky-600/30 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Verify Now</span>
            </Link>
            <Link
              to="/report"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
            >
              <FilePlus2 className="w-4 h-4 text-sky-400" />
              <span>Report a Scam</span>
            </Link>
          </div>

          {/* Verification Search Box directly in Hero */}
          <div className="mt-10 glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 max-w-3xl mx-auto shadow-2xl">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 text-left">
              Quick Identifier Verification Engine
            </p>
            <SearchBox onSearch={handleHeroSearch} isLoading={verifying} isHero={true} />
          </div>
        </div>
      </section>

      {/* Hero Verification Result Container (if user initiated search from hero) */}
      {verificationResult && (
        <section id="verification-result-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              <span>Instant Verification Report</span>
            </h2>
            <button
              onClick={() => setVerificationResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss Result
            </button>
          </div>
          <VerificationResultCard
            result={verificationResult}
            onReset={() => setVerificationResult(null)}
          />
        </section>
      )}

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Total Reports</span>
              <FilePlus2 className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-white mt-3">1,842</p>
            <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <span>+18%</span> from last month
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Verified Scams</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-white mt-3">1,280</p>
            <p className="text-xs text-slate-400 mt-1">Multi-source audited</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Citizens Protected</span>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-white mt-3">48,500+</p>
            <p className="text-xs text-slate-400 mt-1">Via proactive checks</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Reports This Month</span>
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-white mt-3">186</p>
            <p className="text-xs text-amber-400 mt-1 font-medium">Active vigilance queue</p>
          </div>
        </div>
      </section>

      {/* 3. HOW SCAMSHIELD WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400">Process & Verification</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            How ScamShield Protects the Community
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A transparent 4-stage pipeline combining decentralized citizen reports with security moderation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400 flex items-center justify-center font-mono font-bold text-base mb-4">
              01
            </div>
            <h3 className="text-base font-semibold text-white">Submit Information</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Citizens submit details of scam calls, messages, fraudulent websites, or payment requests with relevant context.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400 flex items-center justify-center font-mono font-bold text-base mb-4">
              02
            </div>
            <h3 className="text-base font-semibold text-white">Analyze & Verify</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Identifiers are normalized, cross-matched against existing threat clusters, and evaluated for risk patterns.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400 flex items-center justify-center font-mono font-bold text-base mb-4">
              03
            </div>
            <h3 className="text-base font-semibold text-white">Review Community Reports</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Moderation teams review reported modus operandi, assign risk levels, and mask personal data for public safety.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400 flex items-center justify-center font-mono font-bold text-base mb-4">
              04
            </div>
            <h3 className="text-base font-semibold text-white">Stay Protected</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Search results empower users to stop money transfers, block fraudulent actors, and alert their peers.
            </p>
          </div>
        </div>
      </section>

      {/* 4. RECENTLY REPORTED SCAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400">Live Threat Stream</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Recently Reported Scams</h2>
            <p className="text-sm text-slate-400 mt-1">
              Active incident alerts submitted by citizens and monitored by moderation teams.
            </p>
          </div>
          <Link
            to="/reports"
            className="flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>Explore All Scam Reports</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingReports ? (
          <LoadingSpinner label="Loading recent reports..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>

      {/* 5. COMMON SCAM CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400">Threat Taxonomy</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Common Scam Categories</h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore frequent threat vectors reported across online marketplaces, job boards, and banking channels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/reports?category=${cat.slug}`}
                className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-sky-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">{cat.count}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. SAFETY TIPS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/40">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
                Preventative Cyber Defense
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Essential Rules to Safeguard Your Digital Identity
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Never share bank OTPs or account credentials for receiving money.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Do not install remote-screen apps (AnyDesk, TeamViewer) on request.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Always check domain spelling before entering login passwords.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Reject work-from-home offers demanding upfront security deposits.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/safety"
                className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold text-center transition-colors shadow-md shadow-sky-600/30"
              >
                Open Safety Checklist
              </Link>
              <Link
                to="/report"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold text-center transition-colors"
              >
                Report a Threat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Database,
  Users,
  Search,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  FileCheck2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-400 text-xs font-mono mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Architecture & Governance Charter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          About ScamShield
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          A decentralized cybersecurity intelligence platform engineered to empower citizens with preemptive fraud verification, crowd-sourced vigilance, and community threat defense.
        </p>
      </div>

      {/* Origin & Purpose */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white">The ScamShield Mission</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Digital fraud causes hundreds of crores in financial losses each year across banking channels, social media marketplaces, and instant messaging networks. Fraudsters exploit the asymmetric information gap: by the time a scam is reported in traditional media, thousands of innocent users have already fallen victim to identical phone numbers, cloned payment portals, and fraudulent bank accounts.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>ScamShield</strong> bridges this gap. By turning every citizen into an active threat intelligence node, suspicious numbers and fraudulent links are indexed in real time, allowing anyone to verify a contact before completing a transaction.
        </p>
      </div>

      {/* How It Works (Verification & Integrity) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-sky-950 text-sky-400 border border-sky-500/30 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">1. Community Reporting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Citizens file incident reports specifying scam categories, loss amounts, platform used, and target identifiers with supporting evidence.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-sky-950 text-sky-400 border border-sky-500/30 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">2. Algorithmic Normalization</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Target identifiers (phone numbers, URLs, bank accounts) are sanitized, stripped of formatting discrepancies, and clustered to detect recurrent fraud rings.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-sky-950 text-sky-400 border border-sky-500/30 w-fit">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">3. Moderation & Audit</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Security administrators audit evidence, confirm risk ratings, filter malicious or duplicate entries, and preserve an immutable audit trail.
          </p>
        </div>
      </div>

      {/* Privacy Safeguards & Data Masking */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Privacy Safeguards & Public Masking</h2>
            <p className="text-xs text-slate-400">Protecting reporters and preventing identity doxxing</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ScamShield enforces stringent data masking across all public-facing views. While our database analyzes full identifier hashes for precise search matching:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Phone Numbers</span>
            <p className="text-slate-400 mt-1 font-mono">
              Raw: +91 9876543210 → Display: <strong>+91 98765 XXXXX 10</strong>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Bank Accounts</span>
            <p className="text-slate-400 mt-1 font-mono">
              Raw: 50100234981245 → Display: <strong>5010****245</strong>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Email Addresses</span>
            <p className="text-slate-400 mt-1 font-mono">
              Raw: fraudteam@gmail.com → Display: <strong>f***m@gmail.com</strong>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Reporter Identity</span>
            <p className="text-slate-400 mt-1">
              Reporter email addresses and phone numbers are strictly restricted to admin audit trails.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Architecture */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-sky-400" />
          <span>Technical Architecture (College Full-Stack Blueprint)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-mono text-sky-400 font-bold">Frontend Layer</span>
            <p className="text-slate-300">
              React 19 SPA, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts for data analytics, responsive zero-pill cyber design.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-mono text-sky-400 font-bold">Backend API</span>
            <p className="text-slate-300">
              Express REST server mounted with Vite middlewares, token authentication, risk evaluation heuristics, and audit trail handlers.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-mono text-sky-400 font-bold">Data & Simulation</span>
            <p className="text-slate-300">
              PostgreSQL relational schema (<code className="text-sky-300">database/schema.sql</code>), realistic seed corpus, and local fallback bridge.
            </p>
          </div>
        </div>
      </div>

      {/* Legal & Regulatory Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-3">
        <h3 className="text-slate-200 font-bold uppercase tracking-wider font-mono">
          Statutory Legal Notice & Platform Limitation
        </h3>
        <p>
          1. <strong>No Definitive Certification:</strong> ScamShield provides algorithmic risk scoring based on crowd-sourced reports and publicly audited patterns. A "Safe / No Reports Found" status means no matching complaints currently exist in our database; it does NOT constitute an endorsement or warranty of safety.
        </p>
        <p>
          2. <strong>No Judicial Adjudication:</strong> A report or high-risk badge does not represent a legal indictment or criminal conviction. It reflects community observations filed by citizens.
        </p>
        <p>
          3. <strong>Emergency Protocol:</strong> If you are an active victim of cyber financial fraud, report immediately to <strong>1930</strong> (National Cyber Crime Reporting Portal) and notify your banking institution within the 2-hour golden period.
        </p>
      </div>
    </div>
  );
};

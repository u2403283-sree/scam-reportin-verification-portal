import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, PhoneCall, ExternalLink, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/90 bg-slate-950 text-slate-400">
      {/* Emergency Cybercrime Helpline Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-sky-950/40 border-b border-slate-800 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-300 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>If you have lost money to cyber fraud, act within the golden hour!</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 font-mono font-bold text-white bg-rose-600/90 hover:bg-rose-500 px-3 py-1 rounded-md transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Dial 1930 (National Helpline)
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              cybercrime.gov.in
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-500/40 text-sky-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-mono text-base font-extrabold text-white tracking-wider">
                SCAM<span className="text-sky-400">SHIELD</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering citizens, students, and organizations with crowd-sourced intelligence, proactive verification, and real-time risk indicators to prevent digital fraud.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Network Defense Node Active</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-sky-400 transition-colors">
                  Verify Suspicious Identifier
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-sky-400 transition-colors">
                  File a Scam Report
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-sky-400 transition-colors">
                  Community Scam Database
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-sky-400 transition-colors">
                  Safety Education Center
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">
                  About & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Common Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Monitored Threats
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/reports?category=1" className="hover:text-sky-400 transition-colors">
                  Banking & Wire Fraud
                </Link>
              </li>
              <li>
                <Link to="/reports?category=2" className="hover:text-sky-400 transition-colors">
                  Telegram Job & Task Schemes
                </Link>
              </li>
              <li>
                <Link to="/reports?category=3" className="hover:text-sky-400 transition-colors">
                  Investment & Crypto Ponzis
                </Link>
              </li>
              <li>
                <Link to="/reports?category=4" className="hover:text-sky-400 transition-colors">
                  Fake Shopping Portals
                </Link>
              </li>
              <li>
                <Link to="/reports?category=7" className="hover:text-sky-400 transition-colors">
                  Impersonated Helpline Numbers
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Transparency & Security Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Privacy & Safeguards
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All community submissions mask sensitive personal data. Identifiers are cross-verified and audited before being assigned verified status.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>Encrypted audit trail with role-based moderation access.</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-900 text-slate-400 text-[11px] leading-relaxed space-y-2">
          <p>
            <strong>Disclaimer:</strong> ScamShield is an educational, information sharing, and community reporting portal. Absence of reports in our database does not guarantee that an entity or transaction is authentic, nor does the presence of community complaints constitute a definitive court judgment. Users must independently verify critical transactions and immediately report financial loss to their bank and law enforcement authorities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-3 gap-2">
            <p>© {new Date().getFullYear()} SCAMSHIELD. Built as a full-stack cybersecurity reporting portal.</p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link to="/about" className="hover:text-slate-200 transition-colors">
                Methodology
              </Link>
              <span>·</span>
              <Link to="/safety" className="hover:text-slate-200 transition-colors">
                Safety Checklist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  PhoneCall,
  Laptop,
  CheckSquare,
  Square,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const SafetyCenterPage: React.FC = () => {
  // Interactive "Before You Pay" checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    known_party: false,
    verified_number: false,
    no_pressure: false,
    no_remote_app: false,
    no_pin_to_receive: false,
    official_domain: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const safetyScore = Math.round((checkedCount / 6) * 100);

  let scoreColor = 'text-rose-400';
  let scoreBadge = 'High Fraud Risk — DO NOT TRANSFER FUNDS';
  let scoreBg = 'bg-rose-950/40 border-rose-500/40';

  if (safetyScore >= 80) {
    scoreColor = 'text-emerald-400';
    scoreBadge = 'Optimal Safety Checks Verified';
    scoreBg = 'bg-emerald-950/40 border-emerald-500/40';
  } else if (safetyScore >= 50) {
    scoreColor = 'text-amber-400';
    scoreBadge = 'Proceed With Extreme Caution';
    scoreBg = 'bg-amber-950/40 border-amber-500/40';
  }

  const safetyCards = [
    {
      title: 'Never Share OTPs or Passwords with Unverified Callers',
      category: 'Banking & Accounts',
      icon: KeyRound,
      desc: 'Remember the golden rule of banking: You never need to share a password, secret code, or one-time password (OTP) to receive cashbacks, prizes, or incoming payments.',
    },
    {
      title: 'Urgent Payment Threats Are Always Scams',
      category: 'Psychological Coercion',
      icon: AlertTriangle,
      desc: 'Fraudsters manufacture fake panic: "Electricity will be disconnected at 9:30 PM" or "Your SIM card will be deactivated in 2 hours." Official utilities never demand immediate urgent wire transfers.',
    },
    {
      title: 'Fake Job Offers Demanding Upfront Money',
      category: 'Employment Fraud',
      icon: Laptop,
      desc: 'Legitimate employers never charge for "interview registration fees", "laptop security deposits", or Telegram task commissions (e.g. YouTube video likes).',
    },
    {
      title: 'Inspect Website Domain Spelling',
      category: 'Phishing',
      icon: Lock,
      desc: 'Fraudulent links mimic trusted brands with subtle typos (e.g., sbl.co.in instead of sbi.co.in or indiapost-track.demo instead of indiapost.gov.in). Look for official gov.in or bank domains.',
    },
    {
      title: 'Guaranteed 200%-500% Crypto/Stock Returns Are Ponzi Schemes',
      category: 'Investment Fraud',
      icon: ShieldAlert,
      desc: 'Scammers show simulated dashboard profits but demand heavy "release taxes" or "liquidity deposits" once you request withdrawals. Your initial capital is already stolen.',
    },
    {
      title: 'Remote-Access Software Drains Bank Accounts',
      category: 'Technical Hijacking',
      icon: HelpCircle,
      desc: 'Never install AnyDesk, TeamViewer, RustDesk, or QuickSupport on instructions from a stranger claiming to represent customer care. They can view your OTPs and control your screen.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-400 text-xs font-mono mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Cyber Awareness & Defence Knowledgebase</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          ScamShield Safety & Education Center
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Learn how cyber syndicates exploit human psychology, verify transactions before sending money, and discover emergency steps if you are targeted.
        </p>
      </div>

      {/* Emergency Immediate Action Protocol */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Immediate Golden Hour Response</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                If you transferred money within the last 2 hours, take these 3 steps immediately:
              </p>
            </div>
          </div>

          <a
            href="tel:1930"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-sm transition-colors shadow-lg shadow-rose-600/30 shrink-0"
          >
            Dial 1930 Helpline
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="font-mono text-rose-400 font-bold">1. Call 1930</span>
            <p className="text-slate-300 mt-1">
              Provide transaction UTR / reference number so the National Cybercrime Portal can initiate an interbank freeze.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">2. Lock Bank Cards & Accounts</span>
            <p className="text-slate-300 mt-1">
              Open your mobile banking app and instantly freeze debit cards, internet banking access, and disable unauthorized transfers.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold">3. File Formal Cyber FIR</span>
            <p className="text-slate-300 mt-1">
              Visit <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-sky-400 underline">cybercrime.gov.in</a> and lodge a formal financial complaint with all screenshots.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive "Before You Pay" Checklist */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Verification Tool</span>
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Before You Pay — Self-Check Questionnaire
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Check all items that apply to your upcoming transaction to compute your real-time risk score.
            </p>
          </div>

          {/* Safety Gauge */}
          <div className={`p-4 rounded-xl border ${scoreBg} text-right shrink-0`}>
            <span className="text-[11px] font-mono text-slate-300 uppercase block">Transaction Safety Score</span>
            <span className={`text-2xl font-mono font-extrabold ${scoreColor}`}>{safetyScore}%</span>
            <p className={`text-[11px] font-medium mt-0.5 ${scoreColor}`}>{scoreBadge}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: 'known_party',
              text: 'Have you met this recipient in person or verified them via existing trusted channels?',
            },
            {
              id: 'verified_number',
              text: 'Did you check their phone number, email, or account in the ScamShield database?',
            },
            {
              id: 'no_pressure',
              text: 'Is the party free from artificial urgency, legal threats, or countdown timers?',
            },
            {
              id: 'no_remote_app',
              text: 'Did they NOT ask you to install AnyDesk, TeamViewer, or third-party APKs?',
            },
            {
              id: 'no_pin_to_receive',
              text: 'Are you certain they are NOT asking you to share an OTP or password to "receive money"?',
            },
            {
              id: 'official_domain',
              text: 'Have you verified the URL domain against the authentic organization website?',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                checklist[item.id]
                  ? 'bg-sky-950/40 border-sky-500/40 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <button type="button" className="mt-0.5 text-sky-400 shrink-0">
                {checklist[item.id] ? (
                  <CheckSquare className="w-5 h-5 text-sky-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>
              <span className="text-xs font-medium leading-snug">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How to Recognize a Scam: Educational Cards */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
            Defense Patterns
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Common Scam Modus Operandi & How to Evade Them
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tactics used by fraudsters to manipulate trust, panic, and greed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {safetyCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                      {card.category}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-900 text-sky-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white mt-3 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* External Resources */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
          Official Government & Cyber Defence Resources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-sky-400">
                National Cybercrime Portal
              </p>
              <p className="text-[11px] text-slate-400">cybercrime.gov.in</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
          </a>

          <a
            href="https://www.rbi.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-sky-400">
                RBI "Kehta Hai" Consumer Cell
              </p>
              <p className="text-[11px] text-slate-400">rbi.org.in/commonman</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
          </a>

          <a
            href="https://sancharsaathi.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-sky-400">
                Sanchar Saathi (DoT)
              </p>
              <p className="text-[11px] text-slate-400">Block stolen handsets & check SIMs</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
          </a>
        </div>
      </div>
    </div>
  );
};

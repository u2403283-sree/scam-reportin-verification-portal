import React from 'react';
import { ShieldCheck, KeyRound, ExternalLink, Briefcase, DollarSign, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SafetyCenterPage: React.FC = () => {
  const tips = [
    {
      title: 'Never Share OTPs',
      desc: 'One-time passwords (OTPs) are private security codes. Banks, customer support, or official services will never call or text you asking for your OTP.',
      icon: KeyRound,
    },
    {
      title: 'Be Careful with Unknown Links',
      desc: 'Do not click on links sent via SMS, WhatsApp, or unsolicited emails claiming urgent parcel updates, electricity bills, or prize collections.',
      icon: ExternalLink,
    },
    {
      title: 'Verify Job Offers',
      desc: 'Legitimate employers and recruitment agencies will never ask you to pay an upfront "registration fee", "training deposit", or "task fee" to start working.',
      icon: Briefcase,
    },
    {
      title: 'Do Not Send Money to Unknown People',
      desc: 'Be skeptical of emergency requests from strangers or sudden messages from friends asking for immediate cash transfers without voice verification.',
      icon: DollarSign,
    },
    {
      title: 'Check Website Addresses Carefully',
      desc: 'Always double-check website URLs before entering passwords or payment details. Scammers often use misspelled URLs that look almost identical to real websites.',
      icon: Globe,
    },
    {
      title: 'Do Not Share Passwords',
      desc: 'Keep your login credentials strictly confidential. Never write passwords in public or share them over email, chat applications, or social media.',
      icon: Lock,
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Scam Prevention Guide</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Stay Safe Online</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Helpful tips to protect yourself and your family from common online scams.
        </p>
      </div>

      {/* Safety Tips Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-blue-400 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {tip.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Helpful Action Box */}
      <div className="mt-12 bg-white p-8 rounded-lg border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Encountered a suspicious contact or website?
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          You can check if others have already reported it, or file a report to protect others in the community.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/verify"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Verify Information
          </Link>
          <Link
            to="/report"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
          >
            Report a Scam
          </Link>
        </div>
      </div>
    </div>
  );
};

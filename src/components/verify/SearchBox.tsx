import React, { useState } from 'react';
import { Search, Phone, Mail, Globe, AtSign, CreditCard, ArrowRight, Sparkles } from 'lucide-react';
import { IdentifierType } from '../../types/index.ts';

interface SearchBoxProps {
  onSearch: (type: IdentifierType, query: string) => void;
  isLoading?: boolean;
  initialType?: IdentifierType;
  initialQuery?: string;
  isHero?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  isLoading = false,
  initialType = 'phone',
  initialQuery = '',
  isHero = false,
}) => {
  const [selectedType, setSelectedType] = useState<IdentifierType>(initialType);
  const [query, setQuery] = useState(initialQuery);

  const tabs: { id: IdentifierType; label: string; icon: any; placeholder: string; demo: string }[] = [
    {
      id: 'phone',
      label: 'Phone Number',
      icon: Phone,
      placeholder: '+91 98765 43210',
      demo: '+91 98765 43210',
    },
    {
      id: 'email',
      label: 'Email Address',
      icon: Mail,
      placeholder: 'recruitment.hr@globalworkonline.demo.example',
      demo: 'recruitment.hr@globalworkonline.demo.example',
    },
    {
      id: 'url',
      label: 'Website URL',
      icon: Globe,
      placeholder: 'https://quantuminvest-ai.demo.example',
      demo: 'https://quantuminvest-ai.demo.example',
    },
    {
      id: 'bank_account',
      label: 'Bank Account',
      icon: CreditCard,
      placeholder: '50100234981245',
      demo: '50100234981245',
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: AtSign,
      placeholder: '@task_earning_vip',
      demo: '@task_earning_vip',
    },
  ];

  const currentTab = tabs.find((t) => t.id === selectedType) || tabs[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(selectedType, query.trim());
  };

  const handleQuickFill = (type: IdentifierType, demoVal: string) => {
    setSelectedType(type);
    setQuery(demoVal);
    onSearch(type, demoVal);
  };

  return (
    <div className={`w-full ${isHero ? 'max-w-3xl mx-auto' : 'max-w-4xl mx-auto'}`}>
      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedType(tab.id);
                setQuery('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all shrink-0 cursor-pointer ${
                active
                  ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-400 border-x border-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mt-3 relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <currentTab.icon className="w-5 h-5 text-sky-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={currentTab.placeholder}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm transition-all shadow-md shadow-sky-600/30 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Verify Now</span>
            </span>
          )}
        </button>
      </form>

      {/* Quick Test Chips for demo inspection */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" /> Quick Demos:
        </span>
        <button
          type="button"
          onClick={() => handleQuickFill('phone', '+91 98765 43210')}
          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-sky-500/50 hover:text-sky-300 transition-colors font-mono text-[11px]"
        >
          Job Scam Phone (+91 98765...)
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill('url', 'https://quantuminvest-ai.demo.example')}
          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-sky-500/50 hover:text-sky-300 transition-colors font-mono text-[11px]"
        >
          Crypto Ponzi URL
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill('email', 'refunddesk.airways@fakeairline-support.com')}
          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-sky-500/50 hover:text-sky-300 transition-colors font-mono text-[11px]"
        >
          Fake Support Email
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill('phone', '+91 99999 88888')}
          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/50 transition-colors font-mono text-[11px]"
        >
          Clean/Unreported Phone
        </button>
      </div>
    </div>
  );
};

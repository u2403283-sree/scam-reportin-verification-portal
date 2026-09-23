import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Phone, Mail, Globe, Search, AlertCircle, CheckCircle2, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import { api } from '../services/api.ts';
import { IdentifierType, VerificationResult } from '../types/index.ts';

export const VerifyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as 'phone' | 'email' | 'url') || 'phone';
  const initialQuery = searchParams.get('q') || '';

  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'url'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searchedIdentifier, setSearchedIdentifier] = useState('');

  useEffect(() => {
    if (['phone', 'email', 'url'].includes(initialType)) {
      setActiveTab(initialType);
    }
    if (initialQuery) {
      setInputValue(initialQuery);
      performVerification(initialType, initialQuery);
    }
  }, []);

  const validateInput = (tab: 'phone' | 'email' | 'url', value: string): { valid: boolean; normalized: string; error?: string } => {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, normalized: '', error: 'Please enter a value to verify.' };
    }

    if (tab === 'phone') {
      let digits = trimmed.replace(/[\s\-\(\)]/g, '');
      if (digits.startsWith('+91') && digits.length === 13) {
        digits = digits.slice(3);
      } else if (digits.startsWith('91') && digits.length === 12) {
        digits = digits.slice(2);
      }
      const isValid = /^[0-9]{10}$/.test(digits);
      if (!isValid) {
        return { valid: false, normalized: '', error: 'Please enter a valid 10-digit phone number.' };
      }
      return { valid: true, normalized: digits };
    }

    if (tab === 'email') {
      const atIndex = trimmed.indexOf('@');
      const dotIndex = trimmed.lastIndexOf('.');
      const isValid = atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < trimmed.length - 1;
      if (!isValid) {
        return { valid: false, normalized: '', error: 'Please enter a valid email address.' };
      }
      return { valid: true, normalized: trimmed.toLowerCase() };
    }

    if (tab === 'url') {
      let url = trimmed;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      const dotIndex = url.indexOf('.');
      if (dotIndex === -1 || url.length < 8 || url.includes(' ')) {
        return { valid: false, normalized: '', error: 'Please enter a valid website URL.' };
      }
      return { valid: true, normalized: url };
    }

    return { valid: false, normalized: '', error: 'Invalid input' };
  };

  const performVerification = async (tab: 'phone' | 'email' | 'url', rawVal: string) => {
    const valResult = validateInput(tab, rawVal);
    if (!valResult.valid) {
      setErrorMessage(valResult.error || 'Please enter valid information.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setSearchedIdentifier(valResult.normalized);

    try {
      const data = await api.verifyIdentifier(tab, valResult.normalized);
      setResult(data);
    } catch (err) {
      console.error('Verification error', err);
      setErrorMessage('Unable to complete verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(activeTab, inputValue);
  };

  const handleTabChange = (tab: 'phone' | 'email' | 'url') => {
    setActiveTab(tab);
    setErrorMessage('');
    setResult(null);
  };

  const sampleNumbers = [
    { label: 'Sample Phone', tab: 'phone' as const, val: '9876543210' },
    { label: 'Sample Email', tab: 'email' as const, val: 'support@fakeairline-support.com' },
    { label: 'Sample Website', tab: 'url' as const, val: 'https://quantuminvest-ai.demo.example' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Verify Information</h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Check whether a phone number, email address, or website has been reported by other users.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* 3 Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'phone'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Phone Number</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website URL</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {activeTab === 'phone' && 'Enter 10-Digit Phone Number'}
              {activeTab === 'email' && 'Enter Email Address'}
              {activeTab === 'url' && 'Enter Website URL'}
            </label>
            <div className="relative">
              <input
                type={activeTab === 'email' ? 'email' : 'text'}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder={
                  activeTab === 'phone'
                    ? 'e.g. 9876543210'
                    : activeTab === 'email'
                    ? 'e.g. test@example.com'
                    : 'e.g. https://example.com'
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errorMessage && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Checking records...' : 'Verify Now'}</span>
          </button>
        </form>

        {/* Quick Demo links */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Try demo:</span>
          {sampleNumbers.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setActiveTab(s.tab);
                setInputValue(s.val);
                performVerification(s.tab, s.val);
              }}
              className="text-blue-600 hover:underline bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Section */}
      {result && (
        <div className="max-w-2xl mx-auto mt-8">
          {result.totalReports > 0 ? (
            /* Reports Found */
            <div className="bg-white rounded-lg border border-amber-200 shadow-sm p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Reports Found</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    <strong className="text-amber-700 font-semibold">{result.totalReports} user{result.totalReports > 1 ? 's have' : ' has'}</strong> reported this information.
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Identifier checked: <span className="font-mono font-medium text-slate-700">{searchedIdentifier}</span>
                  </p>
                </div>
              </div>

              {/* Matched Reports List */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Report Details</h3>
                {result.latestReports && result.latestReports.length > 0 ? (
                  result.latestReports.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {item.categoryName || 'Scam'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.incidentDate}
                        </span>
                      </div>
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500">{item.city ? `${item.city}, ${item.state}` : 'Reported Incident'}</span>
                        <Link
                          to={`/reports/${item.id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        >
                          <span>View Full Report</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    Matches were found across previously submitted community complaints.
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/report"
                  className="w-full sm:w-auto text-center px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Submit Your Own Report
                </Link>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-full sm:w-auto text-center px-4 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Clear Results
                </button>
              </div>
            </div>
          ) : (
            /* No Reports Found */
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">No Reports Found</h2>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  No previous reports were found for this information in our database.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Identifier: <span className="font-mono font-medium text-slate-700">{searchedIdentifier}</span>
                </p>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
                Note: A lack of previous reports does not guarantee that a website, caller, or email is completely authentic. Always verify identities independently before transferring money or sharing sensitive credentials.
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Check Another
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

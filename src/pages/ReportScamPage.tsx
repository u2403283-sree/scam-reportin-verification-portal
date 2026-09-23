import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FilePlus2,
  ShieldCheck,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Category, IdentifierType, Report } from '../types/index.ts';
import { maskIdentifier } from '../../server/data/mockDb.ts';
import { Modal } from '../components/ui/Modal.tsx';

interface IdentifierEntry {
  type: IdentifierType;
  value: string;
}

export const ReportScamPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);

  // Form State
  const [reporterName, setReporterName] = useState(user?.name || '');
  const [reporterEmail, setReporterEmail] = useState(user?.email || '');

  const [categoryId, setCategoryId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountLost, setAmountLost] = useState<string>('0');
  const [currency, setCurrency] = useState('INR');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('');
  const [platform, setPlatform] = useState('Telegram');
  const [scamMethod, setScamMethod] = useState('');

  // Identifiers List
  const initialType = (searchParams.get('type') as IdentifierType) || 'phone';
  const initialVal = searchParams.get('value') || '';

  const [identifiers, setIdentifiers] = useState<IdentifierEntry[]>([
    { type: initialType, value: initialVal },
  ]);

  // Evidence files simulation
  const [evidenceFiles, setEvidenceFiles] = useState<
    { fileName: string; fileUrl: string; fileType: string; fileSizeBytes: number }[]
  >([]);

  const [confirmedAccurate, setConfirmedAccurate] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await api.getCategories();
        setCategories(data);
        if (data.length > 0 && !categoryId) {
          setCategoryId(data[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    if (user) {
      if (!reporterName) setReporterName(user.name);
      if (!reporterEmail) setReporterEmail(user.email);
    }
  }, [user]);

  const addIdentifierField = () => {
    setIdentifiers([...identifiers, { type: 'phone', value: '' }]);
  };

  const removeIdentifierField = (index: number) => {
    if (identifiers.length === 1) return;
    setIdentifiers(identifiers.filter((_, i) => i !== index));
  };

  const updateIdentifier = (index: number, field: 'type' | 'value', val: any) => {
    const next = [...identifiers];
    next[index] = { ...next[index], [field]: val };
    setIdentifiers(next);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((f) => ({
      fileName: f.name,
      fileUrl: URL.createObjectURL(f),
      fileType: f.type || 'image/png',
      fileSizeBytes: f.size,
    }));

    setEvidenceFiles([...evidenceFiles, ...newFiles]);
    showToast(`Attached ${files.length} evidence file(s)`, 'success');
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Please enter a descriptive scam title';
    if (!description.trim()) errs.description = 'Please describe what occurred';
    if (description.trim().length < 20)
      errs.description = 'Please provide at least 20 characters for description';
    if (!confirmedAccurate) errs.confirm = 'Please confirm the accuracy declaration';

    const hasValidIdent = identifiers.some((i) => i.value.trim().length > 0);
    if (!hasValidIdent) {
      errs.identifiers = 'Please provide at least one phone, email, URL, or identifier';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please check the highlighted required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const validIdents = identifiers.filter((i) => i.value.trim().length > 0);
      const res = await api.createReport({
        reporterName: reporterName.trim() || 'Anonymous Citizen',
        reporterEmail: reporterEmail.trim() || 'citizen@scamshield.demo',
        categoryId,
        title: title.trim(),
        description: description.trim(),
        incidentDate,
        amountLost: parseFloat(amountLost) || 0,
        currency,
        country,
        state,
        city: city.trim(),
        platform,
        scamMethod: scamMethod.trim(),
        identifiers: validIdents,
        evidence: evidenceFiles,
      });

      setSubmittedReport(res.report);
      showToast('Scam report filed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono mb-3">
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>Incident Submission Channel</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Report a Scam
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Help protect others by sharing information about suspicious activity. All identifying personal contact info is masked before public display.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-800 space-y-8 shadow-2xl">
        {/* SECTION 1: Reporter Information */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-sky-400 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>1. Reporter Information (Private & Confidential)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address (For Status Updates)
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="e.g. yourname@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            * Your personal email and full name will never be exposed on the public scam database.
          </p>
        </div>

        <hr className="border-slate-800" />

        {/* SECTION 2: Scam Details */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-sky-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>2. Scam Incident Details</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Scam Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Platform / Channel Used
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Telegram">Telegram Channel / DM</option>
                  <option value="WhatsApp">WhatsApp Message / Group</option>
                  <option value="SMS">SMS Text Message</option>
                  <option value="Direct Call">Direct Phone Call (Vishing)</option>
                  <option value="Instagram">Instagram Post / DM</option>
                  <option value="Google Search">Google Sponsored Search Ad</option>
                  <option value="Website">Fraudulent Website / E-commerce</option>
                  <option value="Email">Phishing Email</option>
                  <option value="Other">Other Media</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Scam Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fake Electricity Bill Disconnection Warning SMS"
                className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                  errors.title ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Detailed Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened: what claims were made, what apps they asked to install, what payment methods were requested..."
                className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                  errors.description ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-400">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Date of Incident
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Amount Lost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={amountLost}
                  onChange={(e) => setAmountLost(e.target.value)}
                  placeholder="0 if none"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-800" />

        {/* SECTION 3: Identifiers Involved */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Contact / Identifier Involved</span>
            </h3>
            <button
              type="button"
              onClick={addIdentifierField}
              className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Identifier</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Specify the phone number, website link, email, or bank account used by the scammer.
          </p>

          <div className="space-y-3">
            {identifiers.map((ident, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="w-full sm:w-48 shrink-0">
                    <label className="block text-[11px] text-slate-400 mb-1">Identifier Type</label>
                    <select
                      value={ident.type}
                      onChange={(e) =>
                        updateIdentifier(idx, 'type', e.target.value as IdentifierType)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="phone">Phone Number</option>
                      <option value="email">Email Address</option>
                      <option value="url">Website URL</option>
                      <option value="bank_account">Bank Account / IFSC</option>
                      <option value="social">Social Media Handle</option>
                      <option value="other">Other Identifier</option>
                    </select>
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Raw Value (e.g. +91 9876543210 or URL)
                    </label>
                    <input
                      type="text"
                      value={ident.value}
                      onChange={(e) => updateIdentifier(idx, 'value', e.target.value)}
                      placeholder={
                        ident.type === 'phone'
                          ? '+91 98765 43210'
                          : ident.type === 'email'
                          ? 'fraud@example.com'
                          : ident.type === 'url'
                          ? 'https://fake-bank-login.demo'
                          : ident.type === 'bank_account'
                          ? '50100234981245'
                          : 'identifier value'
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  {identifiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIdentifierField(idx)}
                      className="text-rose-400 hover:text-rose-300 p-2 sm:mt-5 transition-colors"
                      aria-label="Remove identifier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {ident.value && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg font-mono">
                    <span className="text-emerald-400">Masked Public Preview:</span>
                    <span className="text-white font-bold">
                      {maskIdentifier(ident.type, ident.value)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.identifiers && (
            <p className="mt-2 text-xs text-rose-400">{errors.identifiers}</p>
          )}
        </div>

        <hr className="border-slate-800" />

        {/* SECTION 4: Evidence Upload */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            <span>4. Evidence Attachment (Screenshots, PDFs, SMS Records)</span>
          </h3>

          <div className="border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-xl p-6 text-center bg-slate-900/40 transition-colors">
            <input
              type="file"
              id="evidence-upload"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="evidence-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <UploadCloud className="w-10 h-10 text-sky-400 mb-2" />
              <p className="text-sm font-semibold text-white">Click to upload evidence documents</p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, or PDF up to 10MB each. Redacted bank receipts or chat transcripts.
              </p>
            </label>
          </div>

          {evidenceFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <span className="text-xs font-mono text-slate-400">Attached files:</span>
              <div className="flex flex-wrap gap-2">
                {evidenceFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                  >
                    <span>{file.fileName}</span>
                    <button
                      type="button"
                      onClick={() => setEvidenceFiles(evidenceFiles.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <hr className="border-slate-800" />

        {/* SECTION 5: Accuracy Confirmation */}
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedAccurate}
              onChange={(e) => setConfirmedAccurate(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-xs text-slate-300 leading-relaxed">
              I confirm that the information provided is accurate to the best of my knowledge and that this report is submitted in good faith for public cyber defense.
            </span>
          </label>
          {errors.confirm && <p className="text-xs text-rose-400">{errors.confirm}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-600/30 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Encrypting & Submitting...</span>
              </span>
            ) : (
              <span>Submit Scam Report</span>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {submittedReport && (
        <Modal
          isOpen={!!submittedReport}
          onClose={() => navigate(`/reports/${submittedReport.reportId}`)}
          title="Scam Report Filed Successfully"
          maxWidth="md"
        >
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Report Registered</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your report has been assigned unique identifier:
              </p>
              <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-lg font-bold text-sky-400">
                {submittedReport.reportId}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Our moderation team will audit the reported identifiers and evidence. Thank you for safeguarding our digital community.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/reports/${submittedReport.reportId}`)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
              >
                View Report Details
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

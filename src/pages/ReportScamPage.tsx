import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addReport, SCAM_TYPES } from '../services/simpleReportService.ts';

/**
 * ReportScamPage.tsx
 * -------------------------------------------------------------
 * A simple form for reporting suspected scams.
 * Strict College Project Constraints:
 * - Only asks for basic non-sensitive fields.
 * - NO bank details, NO passwords, NO Aadhaar, NO OTPs, NO uploads.
 * - Simple manual JavaScript validation with error messages below fields.
 */
export const ReportScamPage: React.FC = () => {
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [scamType, setScamType] = useState(SCAM_TYPES[0]);
  const [reportedInfo, setReportedInfo] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Field validation error states
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    reportedInfo?: string;
    subject?: string;
    description?: string;
  }>({});

  // Success message after submission
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  /**
   * Validate fields using simple rules
   */
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // 1. Email validation: must contain '@' and '.'
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address (must contain @ and .)';
    }

    // 2. Phone validation: exactly 10 digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (digitsOnly.length !== 10) {
      newErrors.phone = 'Phone number must contain exactly 10 digits.';
    }

    // 3. Suspicious information reported
    if (!reportedInfo.trim()) {
      newErrors.reportedInfo = 'Please enter the suspicious phone number, email, or website.';
    }

    // 4. Subject
    if (!subject.trim()) {
      newErrors.subject = 'Subject / short description is required.';
    }

    // 5. Description
    if (!description.trim()) {
      newErrors.description = 'Please provide a detailed description of the incident.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Save report to service (and LocalStorage)
    const newReport = addReport({
      reporterName: name,
      reporterEmail: email,
      reporterPhone: phone,
      scamType,
      reportedInfo,
      subject,
      description,
    });

    // Show success banner with the generated ID
    setSubmittedReportId(newReport.id);

    // Reset form fields
    setName('');
    setEmail('');
    setPhone('');
    setReportedInfo('');
    setSubject('');
    setDescription('');
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report a Scam</h1>
        <p className="text-sm text-gray-600 mt-1">
          Fill out this simple form to submit information about a suspected scam.
        </p>
      </div>

      {/* Safety Notice: We never ask for sensitive financial data */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded p-3 mb-6">
        <strong>Privacy Notice:</strong> We do not ask for bank account numbers, passwords, OTPs, or Aadhaar details. Never share financial credentials with anyone.
      </div>

      {/* Success Notification */}
      {submittedReportId && (
        <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded mb-6">
          <p className="font-bold text-base">Report Submitted Successfully!</p>
          <p className="text-sm mt-1">
            Your report ID is <span className="font-mono font-bold">{submittedReportId}</span>.
            The report has been saved and queued for review.
          </p>
          <div className="mt-3 flex gap-3 text-sm">
            <Link to="/reports" className="text-green-800 underline font-medium">
              View in Reports Table &rarr;
            </Link>
            <Link to="/check" className="text-green-800 underline font-medium">
              Verify in Search &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded p-6 shadow-sm space-y-4">
        {/* Name Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Email Field (Required) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'
            }`}
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number Field (Required, exactly 10 digits) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Phone Number (10 digits) <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
              errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'
            }`}
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Scam Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scam Type <span className="text-red-500">*</span>
          </label>
          <select
            value={scamType}
            onChange={(e) => setScamType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600"
          >
            {SCAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Suspicious Info Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suspicious Information (Phone / Email / Website) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={reportedInfo}
            onChange={(e) => setReportedInfo(e.target.value)}
            placeholder="e.g. 9876543210 or fake-jobs@scam.com or fake-store.com"
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
              errors.reportedInfo ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'
            }`}
          />
          {errors.reportedInfo && (
            <p className="text-red-600 text-xs mt-1">{errors.reportedInfo}</p>
          )}
        </div>

        {/* Subject / Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject / Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Received fake job letter asking for security deposit"
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
              errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'
            }`}
          />
          {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject}</p>}
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what happened: what message did they send, what did they claim, etc."
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
              errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'
            }`}
          />
          {errors.description && (
            <p className="text-red-600 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition-colors cursor-pointer"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

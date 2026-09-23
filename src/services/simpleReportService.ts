/**
 * simpleReportService.ts
 * -------------------------------------------------------------
 * Beginner-friendly data service for the Scam Reporting & Verification Portal.
 * Designed for an academic project demonstration.
 *
 * Provides:
 * 1. Initial sample reports for testing and demonstration.
 * 2. User side methods: get reports, submit new report, check report, view my reports.
 * 3. Admin side methods: review reports, change status (Reviewed/Under Review/Rejected), delete.
 * 4. Simple role switcher (User vs Admin) for easy viva evaluation.
 */

export interface SimpleReport {
  id: string; // Unique Report ID e.g. "REP-101"
  reporterName: string; // Reporter's name (optional, defaults to "Anonymous")
  reporterEmail: string; // Reporter's email address
  reporterPhone: string; // Reporter's 10-digit phone number
  scamType: string; // Category e.g. "Fake Job Scam", "Phishing Email", etc.
  reportedInfo: string; // The suspicious phone number, email, or website
  infoType: 'phone' | 'email' | 'website'; // Type of information reported
  subject: string; // Short summary/subject
  description: string; // Full incident description
  status: 'Under Review' | 'Reviewed' | 'Rejected'; // Status of the report
  createdAt: string; // Submission date
}

// Available Scam Types for dropdown selection
export const SCAM_TYPES = [
  'Fake Job Scam',
  'Online Shopping Scam',
  'Phishing Email',
  'Fake Customer Care Call',
  'Social Media Scam',
  'Lottery / Prize Scam',
  'Other',
];

// Initial realistic sample data
const INITIAL_REPORTS: SimpleReport[] = [
  {
    id: 'REP-101',
    reporterName: 'Rahul Sharma',
    reporterEmail: 'rahul.s@example.com',
    reporterPhone: '9876543210',
    scamType: 'Fake Job Scam',
    reportedInfo: 'hr@google-careers-india.org',
    infoType: 'email',
    subject: 'Fake Work-From-Home Job Offer',
    description:
      'Received an email claiming selection for a remote data entry job asking for a registration fee of ₹2,500.',
    status: 'Reviewed',
    createdAt: '2026-09-15',
  },
  {
    id: 'REP-102',
    reporterName: 'Ananya Verma',
    reporterEmail: 'ananya.v@example.com',
    reporterPhone: '9123456780',
    scamType: 'Fake Customer Care Call',
    reportedInfo: '9876543210',
    infoType: 'phone',
    subject: 'Impersonating SBI Customer Support',
    description:
      'Caller claimed that my debit card is blocked and demanded urgent verification of details over phone.',
    status: 'Reviewed',
    createdAt: '2026-09-16',
  },
  {
    id: 'REP-103',
    reporterName: 'Amit Patel',
    reporterEmail: 'amit.patel@example.com',
    reporterPhone: '9988776655',
    scamType: 'Online Shopping Scam',
    reportedInfo: 'amazn-discount-store.shop',
    infoType: 'website',
    subject: 'Fake Shopping Website Selling Laptops',
    description:
      'Website offered brand new gaming laptops at 80% discount. Payment was collected but no order confirmation was sent.',
    status: 'Reviewed',
    createdAt: '2026-09-17',
  },
  {
    id: 'REP-104',
    reporterName: 'Sneha Nair',
    reporterEmail: 'sneha.n@example.com',
    reporterPhone: '9447112233',
    scamType: 'Phishing Email',
    reportedInfo: 'security-alert@income-tax-refund.net',
    infoType: 'email',
    subject: 'Fake Income Tax Refund Notice',
    description:
      'Phishing email asked to click a link to claim an unclaimed refund of ₹14,500 with a fake tax portal login page.',
    status: 'Reviewed',
    createdAt: '2026-09-18',
  },
  {
    id: 'REP-105',
    reporterName: 'Karthik Menon',
    reporterEmail: 'karthik.m@example.com',
    reporterPhone: '9845012345',
    scamType: 'Social Media Scam',
    reportedInfo: 'instagram.com/crypto_double_invest',
    infoType: 'website',
    subject: 'Instagram Crypto Investment Scheme',
    description:
      'Promised 200% returns within 24 hours through a Telegram group link posted on an Instagram story.',
    status: 'Under Review',
    createdAt: '2026-09-19',
  },
  {
    id: 'REP-106',
    reporterName: 'Priya Sundaram',
    reporterEmail: 'priya.s@example.com',
    reporterPhone: '9789012345',
    scamType: 'Fake Customer Care Call',
    reportedInfo: '8012345678',
    infoType: 'phone',
    subject: 'Electricity Bill Disconnection Threat',
    description:
      'SMS received stating power supply would be disconnected tonight unless bill paid by calling this number.',
    status: 'Under Review',
    createdAt: '2026-09-20',
  },
];

const STORAGE_KEY = 'college_scam_portal_reports';
const ROLE_KEY = 'college_scam_portal_role';

/**
 * Role management: User or Admin
 */
export function getCurrentRole(): 'user' | 'admin' {
  try {
    const role = localStorage.getItem(ROLE_KEY);
    return role === 'admin' ? 'admin' : 'user';
  } catch {
    return 'user';
  }
}

export function setCurrentRole(role: 'user' | 'admin'): void {
  try {
    localStorage.setItem(ROLE_KEY, role);
    window.dispatchEvent(new Event('roleChange'));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Retrieves all reports from LocalStorage.
 * If empty, initializes with the sample data.
 */
export function getAllReports(): SimpleReport[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_REPORTS;
  } catch (error) {
    console.error('Error loading reports:', error);
    return INITIAL_REPORTS;
  }
}

/**
 * Saves a new report submitted from the form.
 */
export function addReport(data: {
  reporterName?: string;
  reporterEmail: string;
  reporterPhone: string;
  scamType: string;
  reportedInfo: string;
  subject: string;
  description: string;
}): SimpleReport {
  const currentReports = getAllReports();

  // Detect type of suspicious information (phone, email, or website)
  let infoType: 'phone' | 'email' | 'website' = 'phone';
  const val = data.reportedInfo.trim().toLowerCase();
  if (val.includes('@')) {
    infoType = 'email';
  } else if (val.includes('.') || val.startsWith('http') || val.startsWith('www')) {
    infoType = 'website';
  } else {
    infoType = 'phone';
  }

  // Generate next readable ID, e.g., REP-107
  const nextNumber = 100 + currentReports.length + 1;
  const newReport: SimpleReport = {
    id: `REP-${nextNumber}`,
    reporterName: data.reporterName?.trim() || 'Anonymous',
    reporterEmail: data.reporterEmail.trim(),
    reporterPhone: data.reporterPhone.trim(),
    scamType: data.scamType,
    reportedInfo: data.reportedInfo.trim(),
    infoType,
    subject: data.subject.trim(),
    description: data.description.trim(),
    status: 'Under Review',
    createdAt: new Date().toISOString().split('T')[0],
  };

  // Prepend to list so newest is first
  const updatedList = [newReport, ...currentReports];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

  return newReport;
}

/**
 * Admin action: Update status of a report
 */
export function updateReportStatus(
  reportId: string,
  newStatus: 'Under Review' | 'Reviewed' | 'Rejected'
): boolean {
  try {
    const list = getAllReports();
    const idx = list.findIndex((r) => r.id === reportId);
    if (idx !== -1) {
      list[idx].status = newStatus;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error updating status:', e);
    return false;
  }
}

/**
 * Admin action: Delete a report
 */
export function deleteReport(reportId: string): boolean {
  try {
    const list = getAllReports();
    const filtered = list.filter((r) => r.id !== reportId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting report:', e);
    return false;
  }
}

/**
 * Result structure when checking an identifier.
 */
export interface CheckResult {
  isFound: boolean;
  statusText: 'Reported' | 'Not Found';
  query: string;
  matchedReports: SimpleReport[];
  totalReports: number;
}

/**
 * Checks if a phone number, email address, or website has been reported.
 */
export function checkReport(queryInput: string): CheckResult {
  const query = queryInput.trim().toLowerCase();
  if (!query) {
    return {
      isFound: false,
      statusText: 'Not Found',
      query: '',
      matchedReports: [],
      totalReports: 0,
    };
  }

  const reports = getAllReports();
  const cleanDigits = query.replace(/\D/g, '');

  const matches = reports.filter((r) => {
    const target = r.reportedInfo.toLowerCase();
    const targetDigits = target.replace(/\D/g, '');

    // Check direct substring
    if (target.includes(query) || query.includes(target)) {
      return true;
    }

    // Check phone match
    if (cleanDigits.length >= 7 && targetDigits.includes(cleanDigits)) {
      return true;
    }

    return false;
  });

  return {
    isFound: matches.length > 0,
    statusText: matches.length > 0 ? 'Reported' : 'Not Found',
    query: queryInput.trim(),
    matchedReports: matches,
    totalReports: matches.length,
  };
}

/**
 * Calculates statistics for Admin & Home
 */
export function getSimpleStats() {
  const reports = getAllReports();
  const reviewed = reports.filter((r) => r.status === 'Reviewed').length;
  const underReview = reports.filter((r) => r.status === 'Under Review').length;
  const rejected = reports.filter((r) => r.status === 'Rejected').length;
  const scamTypesCount = new Set(reports.map((r) => r.scamType)).size;

  return {
    totalSubmitted: reports.length,
    totalReviewed: reviewed,
    totalUnderReview: underReview,
    totalRejected: rejected,
    scamTypesCount: Math.max(scamTypesCount, SCAM_TYPES.length),
  };
}

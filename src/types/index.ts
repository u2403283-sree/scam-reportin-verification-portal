export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Additional Information Required'
  | 'Verified'
  | 'Rejected'
  | 'Duplicate';

export type IdentifierType =
  | 'phone'
  | 'email'
  | 'url'
  | 'bank_account'
  | 'social'
  | 'crypto_wallet'
  | 'other';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  severityLevel: RiskLevel;
}

export interface ReportIdentifier {
  id: number;
  reportId?: number;
  type: IdentifierType;
  value: string;
  maskedValue: string;
}

export interface ReportEvidence {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
}

export interface ModerationAction {
  id: number;
  reportId: number;
  adminId: number;
  adminName: string;
  action: 'approve' | 'reject' | 'request_info' | 'change_risk' | 'mark_duplicate';
  previousStatus?: ReportStatus;
  newStatus?: ReportStatus;
  comment: string;
  createdAt: string;
}

export interface Report {
  id: number;
  reportId: string; // e.g. 'SCAM-2026-000124'
  userId?: number;
  reporterName: string;
  reporterEmail: string;
  categoryId: number;
  categoryName?: string;
  title: string;
  description: string;
  incidentDate: string;
  amountLost: number;
  currency: string;
  country: string;
  state: string;
  city: string;
  platform: string;
  scamMethod?: string;
  riskLevel: RiskLevel;
  status: ReportStatus;
  communityUpvotes: number;
  viewsCount: number;
  identifiers: ReportIdentifier[];
  evidence?: ReportEvidence[];
  moderationHistory?: ModerationAction[];
  createdAt: string;
  updatedAt: string;
}

export interface VerificationResult {
  identifierType: IdentifierType;
  rawInput: string;
  maskedIdentifier: string;
  totalReports: number;
  riskLevel: 'safe' | 'low' | 'suspicious' | 'high' | 'critical';
  statusHeading: string;
  statusDescription: string;
  categories: { name: string; count: number }[];
  latestReports: {
    id: number;
    reportId: string;
    title: string;
    categoryName: string;
    riskLevel: RiskLevel;
    incidentDate: string;
    city: string;
    state: string;
  }[];
  disclaimer: string;
  recommendedAction: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action_required';
  reportId?: string;
  readStatus: boolean;
  createdAt: string;
}

export interface VerificationSearchLog {
  id: number;
  userId?: number;
  identifierType: IdentifierType;
  identifierValue: string;
  maskedValue: string;
  resultStatus: 'no_reports' | 'limited' | 'suspicious' | 'frequently_reported';
  reportsMatched: number;
  searchedAt: string;
}

export interface AnalyticsData {
  totalReports: number;
  totalUsers: number;
  verifiedReports: number;
  pendingReviews: number;
  rejectedReports: number;
  highRiskReports: number;
  totalAmountLost: number;
  reportsByCategory: { name: string; count: number; percentage: number }[];
  reportsOverTime: { month: string; reports: number; lossInThousands: number }[];
  riskDistribution: { name: string; count: number; color: string }[];
  reportsByLocation: { state: string; count: number }[];
  topReportedIdentifiers: {
    type: IdentifierType;
    masked: string;
    count: number;
    category: string;
    riskLevel: RiskLevel;
  }[];
}

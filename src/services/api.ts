import {
  User,
  Category,
  Report,
  VerificationResult,
  NotificationItem,
  VerificationSearchLog,
  AnalyticsData,
  IdentifierType,
  ReportStatus,
  RiskLevel
} from '../types/index.ts';
import { initialCategories, initialReports, initialUsers, maskIdentifier } from '../../server/data/mockDb.ts';

const TOKEN_KEY = 'scamshield_auth_token';
const USER_KEY = 'scamshield_current_user';
const LOCAL_REPORTS_KEY = 'scamshield_reports_db';
const LOCAL_SEARCHES_KEY = 'scamshield_searches_db';
const LOCAL_NOTIFS_KEY = 'scamshield_notifs_db';

// Initialize localStorage cache if empty
function getLocalReports(): Report[] {
  try {
    const raw = localStorage.getItem(LOCAL_REPORTS_KEY);
    if (raw) {
      const parsed: Report[] = JSON.parse(raw);
      // Sanitize any legacy UPI entries from cache
      return parsed.map(rep => ({
        ...rep,
        categoryName: rep.categoryName?.replace(/Banking \/ UPI/i, 'Banking & Financial') || rep.categoryName,
        identifiers: rep.identifiers
          .filter(id => (id.type as string) !== 'upi')
          .map(id => ({ ...id })),
      }));
    }
  } catch (e) {
    // fallback
  }
  return [...initialReports];
}

function saveLocalReports(reports: Report[]) {
  try {
    localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    // ignored
  }
}

function getLocalSearches(): VerificationSearchLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_SEARCHES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 1,
      userId: 2,
      identifierType: 'phone',
      identifierValue: '+919876543210',
      maskedValue: '+91 98765 XXXXX 10',
      resultStatus: 'frequently_reported',
      reportsMatched: 14,
      searchedAt: '2026-09-21T10:15:00Z',
    },
    {
      id: 2,
      userId: 2,
      identifierType: 'url',
      identifierValue: 'https://quantuminvest-ai.demo.example',
      maskedValue: 'https://quantuminvest-***.demo.example',
      resultStatus: 'suspicious',
      reportsMatched: 6,
      searchedAt: '2026-09-20T18:40:00Z',
    },
  ];
}

function getLocalNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_NOTIFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: 1,
      userId: 2,
      title: 'Report Verified',
      message: 'Your scam report SCAM-2026-000124 has been verified by the moderation team.',
      type: 'success',
      reportId: 'SCAM-2026-000124',
      readStatus: false,
      createdAt: '2026-09-15T10:00:00Z',
    },
    {
      id: 2,
      userId: 2,
      title: 'High Risk Identifier Warning',
      message: 'A phone number you verified was recently flagged in 8 new reports.',
      type: 'warning',
      readStatus: false,
      createdAt: '2026-09-20T14:00:00Z',
    },
    {
      id: 3,
      userId: 2,
      title: 'Report Submitted',
      message: 'Your report SCAM-2026-000134 was received and is under review.',
      type: 'info',
      reportId: 'SCAM-2026-000134',
      readStatus: true,
      createdAt: '2026-09-15T11:25:00Z',
    },
  ];
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Generic request with automatic local fallback
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackFn?: () => T
  ): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (response.ok) {
        return await response.json();
      }

      // If server returned an error json
      const errData = await response.json().catch(() => ({}));
      if (errData.error && !fallbackFn) {
        throw new Error(errData.error);
      }
    } catch (err: any) {
      if (!fallbackFn) throw err;
    }

    if (fallbackFn) {
      return fallbackFn();
    }
    throw new Error('API request failed');
  }

  // ---------------- AUTH ----------------
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      () => {
        // Fallback demo login
        const found = initialUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (
          (email === 'admin@scamshield.demo' && password === 'Admin@123') ||
          (email === 'user@scamshield.demo' && password === 'Demo@123') ||
          (found && (found.passwordHash === password || password === 'Demo@123'))
        ) {
          const user: User = found || {
            id: 2,
            name: 'Aarav Sharma',
            email: 'user@scamshield.demo',
            role: 'user',
            phone: '+91 98000 00002',
            createdAt: '2026-08-01T12:00:00Z',
          };
          const token = `demo_token_${user.id}_${Date.now()}`;
          return { user, token };
        }
        throw new Error('Invalid email or password. Use demo credentials from the login screen.');
      }
    );
  }

  async register(name: string, email: string, password: string, phone?: string): Promise<{ user: User; token: string }> {
    return this.request(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      },
      () => {
        const user: User = {
          id: Date.now(),
          name: name.trim(),
          email: email.trim(),
          role: 'user',
          phone: phone || '',
          createdAt: new Date().toISOString(),
        };
        const token = `demo_token_${user.id}_${Date.now()}`;
        return { user, token };
      }
    );
  }

  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  }

  // ---------------- CATEGORIES ----------------
  async getCategories(): Promise<Category[]> {
    return this.request('/api/categories', {}, () => initialCategories);
  }

  // ---------------- REPORTS ----------------
  async getReports(params: {
    search?: string;
    category?: string;
    risk?: string;
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ reports: Report[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.risk) query.set('risk', params.risk);
    if (params.status) query.set('status', params.status);
    if (params.sort) query.set('sort', params.sort);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit || 12));

    return this.request(`/api/reports?${query.toString()}`, {}, () => {
      let list = getLocalReports();
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.reportId.toLowerCase().includes(q) ||
            r.city?.toLowerCase().includes(q) ||
            r.state?.toLowerCase().includes(q) ||
            r.identifiers.some((i) => i.value.toLowerCase().includes(q) || i.maskedValue.toLowerCase().includes(q))
        );
      }
      if (params.category && params.category !== 'all') {
        list = list.filter((r) => String(r.categoryId) === params.category || r.categoryName === params.category);
      }
      if (params.risk && params.risk !== 'all') {
        list = list.filter((r) => r.riskLevel.toLowerCase() === params.risk?.toLowerCase());
      }
      if (params.status && params.status !== 'all') {
        list = list.filter((r) => r.status.toLowerCase() === params.status?.toLowerCase());
      }
      if (params.sort === 'most_reported') {
        list.sort((a, b) => b.communityUpvotes - a.communityUpvotes);
      } else if (params.sort === 'highest_risk') {
        const p: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        list.sort((a, b) => (p[b.riskLevel] || 0) - (p[a.riskLevel] || 0));
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = list.length;
      const page = params.page || 1;
      const limit = params.limit || 12;
      const paginated = list.slice((page - 1) * limit, page * limit);
      return { reports: paginated, total, page, totalPages: Math.ceil(total / limit) };
    });
  }

  async getReportById(id: string): Promise<Report> {
    return this.request(`/api/reports/${id}`, {}, () => {
      const reports = getLocalReports();
      const report = reports.find((r) => String(r.id) === id || r.reportId.toLowerCase() === id.toLowerCase());
      if (!report) throw new Error('Report not found');
      report.viewsCount = (report.viewsCount || 0) + 1;
      saveLocalReports(reports);
      return report;
    });
  }

  async getMyReports(): Promise<Report[]> {
    return this.request('/api/reports/my', {}, () => {
      const user = this.getLocalUser();
      const userId = user ? user.id : 2;
      return getLocalReports().filter((r) => r.userId === userId);
    });
  }

  async createReport(data: {
    reporterName: string;
    reporterEmail: string;
    categoryId: number;
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
    identifiers: { type: IdentifierType; value: string }[];
    evidence?: { fileName: string; fileUrl: string; fileType: string; fileSizeBytes: number }[];
  }): Promise<{ message: string; report: Report }> {
    const user = this.getLocalUser();
    return this.request(
      '/api/reports',
      {
        method: 'POST',
        body: JSON.stringify({ ...data, userId: user?.id }),
      },
      () => {
        const reports = getLocalReports();
        const nextId = reports.length + 100;
        const reportId = `SCAM-2026-${String(nextId).padStart(6, '0')}`;
        const cat = initialCategories.find((c) => c.id === Number(data.categoryId));

        let riskLevel: RiskLevel = 'medium';
        if (data.amountLost > 50000) riskLevel = 'critical';
        else if (data.amountLost > 10000) riskLevel = 'high';
        else if (data.amountLost > 0) riskLevel = 'medium';
        else riskLevel = 'low';

        const newRep: Report = {
          id: Date.now(),
          reportId,
          userId: user?.id || 2,
          reporterName: data.reporterName || user?.name || 'Anonymous Citizen',
          reporterEmail: data.reporterEmail || user?.email || 'reporter@example.com',
          categoryId: Number(data.categoryId),
          categoryName: cat?.name || 'Scam Report',
          title: data.title,
          description: data.description,
          incidentDate: data.incidentDate,
          amountLost: Number(data.amountLost) || 0,
          currency: data.currency || 'INR',
          country: data.country || 'India',
          state: data.state || 'Maharashtra',
          city: data.city || 'Mumbai',
          platform: data.platform || 'Online',
          scamMethod: data.scamMethod,
          riskLevel,
          status: 'Submitted',
          communityUpvotes: 1,
          viewsCount: 1,
          identifiers: data.identifiers.map((ident, i) => ({
            id: Date.now() + i,
            type: ident.type,
            value: ident.value,
            maskedValue: maskIdentifier(ident.type, ident.value),
          })),
          evidence: data.evidence?.map((e, i) => ({ id: Date.now() + i, ...e })),
          moderationHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        reports.unshift(newRep);
        saveLocalReports(reports);

        // add notification
        const notifs = getLocalNotifications();
        notifs.unshift({
          id: Date.now(),
          userId: user?.id || 2,
          title: 'Scam Report Submitted',
          message: `Your scam report ${reportId} has been submitted successfully and queued for review.`,
          type: 'info',
          reportId,
          readStatus: false,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifs));

        return { message: 'Report submitted successfully', report: newRep };
      }
    );
  }

  // ---------------- VERIFICATION ----------------
  async verifyIdentifier(type: IdentifierType, query: string): Promise<VerificationResult> {
    return this.request(
      '/api/verify',
      {
        method: 'POST',
        body: JSON.stringify({ type, query }),
      },
      () => {
        const rawClean = query.trim();
        const norm = rawClean.toLowerCase().replace(/[\s\-\(\)]/g, '');
        const reports = getLocalReports();

        const matches: Report[] = [];
        reports.forEach((r) => {
          const match = r.identifiers.some((ident) => {
            const idNorm = ident.value.toLowerCase().replace(/[\s\-\(\)]/g, '');
            if (type === 'phone') {
              const last8 = norm.slice(-8);
              return last8.length >= 7 && idNorm.includes(last8);
            }
            if (type === 'email') {
              return idNorm === norm || idNorm.includes(norm) || norm.includes(idNorm);
            }
            if (type === 'url') {
              const d = norm.replace(/^https?:\/\//, '').split('/')[0];
              return idNorm.includes(d) || d.includes(idNorm.replace(/^https?:\/\//, '').split('/')[0]);
            }
            if (type === 'social') {
              return idNorm.includes(norm.replace(/^@/, ''));
            }
            return idNorm.includes(norm);
          });
          if (match) matches.push(r);
        });

        const count = matches.length;
        let riskLevel: 'safe' | 'low' | 'suspicious' | 'high' | 'critical' = 'safe';
        let statusHeading = 'No Community Reports Found';
        let statusDescription = 'No scam reports currently match this identifier in our community database.';
        let recommendedAction = 'Maintain standard caution. Never share OTPs or install remote management apps.';

        if (count === 0) {
          riskLevel = 'safe';
        } else if (count <= 2) {
          riskLevel = 'low';
          statusHeading = 'Limited Community Reports Found';
          statusDescription = `Found ${count} report(s) referencing this identifier. Caution recommended.`;
          recommendedAction = 'Verify caller identity independently before sending funds.';
        } else if (count <= 5) {
          riskLevel = 'suspicious';
          statusHeading = 'Suspicious Activity Flagged';
          statusDescription = `Multiple community members (${count} reports) have reported suspicious interaction with this identifier.`;
          recommendedAction = 'High risk. Do not send upfront payments or click links from this source.';
        } else {
          riskLevel = 'critical';
          statusHeading = 'High Risk — Frequently Reported Identifier';
          statusDescription = `This identifier is associated with ${count} confirmed community scam reports.`;
          recommendedAction = 'STOP all contact immediately. Block this party and file a formal report.';
        }

        const masked = maskIdentifier(type, rawClean);
        const catMap: Record<string, number> = {};
        matches.forEach((r) => {
          const c = r.categoryName || 'General';
          catMap[c] = (catMap[c] || 0) + 1;
        });

        return {
          identifierType: type,
          rawInput: rawClean,
          maskedIdentifier: masked,
          totalReports: count,
          riskLevel,
          statusHeading,
          statusDescription,
          categories: Object.entries(catMap).map(([name, count]) => ({ name, count })),
          latestReports: matches.slice(0, 4).map((r) => ({
            id: r.id,
            reportId: r.reportId,
            title: r.title,
            categoryName: r.categoryName || 'General',
            riskLevel: r.riskLevel,
            incidentDate: r.incidentDate,
            city: r.city,
            state: r.state,
          })),
          disclaimer:
            'ScamShield is an intelligence and community reporting platform. Absence of reports does not prove authenticity, nor does a report constitute a legal conviction. Always perform independent checks.',
          recommendedAction,
        };
      }
    );
  }

  async getVerificationHistory(): Promise<VerificationSearchLog[]> {
    return this.request('/api/verify/history', {}, () => getLocalSearches());
  }

  // ---------------- ADMIN ----------------
  async getAdminReports(): Promise<Report[]> {
    return this.request('/api/admin/reports', {}, () => getLocalReports());
  }

  async reviewReport(
    id: number | string,
    actionData: {
      action: 'approve' | 'reject' | 'request_info' | 'change_risk' | 'mark_duplicate';
      status?: ReportStatus;
      riskLevel?: RiskLevel;
      comment: string;
    }
  ): Promise<{ message: string; report: Report }> {
    return this.request(
      `/api/admin/reports/${id}/review`,
      {
        method: 'PUT',
        body: JSON.stringify(actionData),
      },
      () => {
        const reports = getLocalReports();
        const rep = reports.find((r) => String(r.id) === String(id) || r.reportId === String(id));
        if (!rep) throw new Error('Report not found');

        const prev = rep.status;
        if (actionData.status) rep.status = actionData.status;
        if (actionData.riskLevel) rep.riskLevel = actionData.riskLevel;

        rep.moderationHistory = rep.moderationHistory || [];
        rep.moderationHistory.unshift({
          id: Date.now(),
          reportId: rep.id,
          adminId: 1,
          adminName: 'Cyber Security Admin',
          action: actionData.action,
          previousStatus: prev,
          newStatus: rep.status,
          comment: actionData.comment,
          createdAt: new Date().toISOString(),
        });
        rep.updatedAt = new Date().toISOString();

        saveLocalReports(reports);
        return { message: 'Report reviewed successfully', report: rep };
      }
    );
  }

  async getAnalytics(): Promise<AnalyticsData> {
    return this.request('/api/admin/analytics', {}, () => {
      const reports = getLocalReports();
      const totalReports = reports.length;
      const totalUsers = 15;
      const verifiedReports = reports.filter((r) => r.status === 'Verified').length;
      const pendingReviews = reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
      const rejectedReports = reports.filter((r) => r.status === 'Rejected').length;
      const highRiskReports = reports.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical').length;
      const totalAmountLost = reports.reduce((s, r) => s + (r.amountLost || 0), 0);

      const catCounts: Record<string, number> = {};
      reports.forEach((r) => {
        const c = r.categoryName || 'Other';
        catCounts[c] = (catCounts[c] || 0) + 1;
      });

      const riskCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
      reports.forEach((r) => {
        riskCounts[r.riskLevel] = (riskCounts[r.riskLevel] || 0) + 1;
      });

      const stateCounts: Record<string, number> = {};
      reports.forEach((r) => {
        if (r.state) stateCounts[r.state] = (stateCounts[r.state] || 0) + 1;
      });

      return {
        totalReports,
        totalUsers,
        verifiedReports,
        pendingReviews,
        rejectedReports,
        highRiskReports,
        totalAmountLost,
        reportsByCategory: Object.entries(catCounts).map(([name, count]) => ({
          name,
          count,
          percentage: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0,
        })),
        reportsOverTime: [
          { month: 'Apr', reports: 12, lossInThousands: 140 },
          { month: 'May', reports: 19, lossInThousands: 280 },
          { month: 'Jun', reports: 24, lossInThousands: 360 },
          { month: 'Jul', reports: 31, lossInThousands: 490 },
          { month: 'Aug', reports: 42, lossInThousands: 720 },
          { month: 'Sep', reports: 56, lossInThousands: 945 },
        ],
        riskDistribution: [
          { name: 'LOW', count: riskCounts.low || 1, color: '#10b981' },
          { name: 'MEDIUM', count: riskCounts.medium || 3, color: '#0ea5e9' },
          { name: 'HIGH', count: riskCounts.high || 5, color: '#f59e0b' },
          { name: 'CRITICAL', count: riskCounts.critical || 6, color: '#ef4444' },
        ],
        reportsByLocation: Object.entries(stateCounts)
          .map(([state, count]) => ({ state, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6),
        topReportedIdentifiers: [
          { type: 'phone', masked: '+91 98765 XXXXX 10', count: 34, category: 'Job Scam', riskLevel: 'high' },
          { type: 'phone', masked: '+91 91234 XXXXX 80', count: 48, category: 'Banking & Financial', riskLevel: 'critical' },
          { type: 'url', masked: 'https://quantuminvest-***.demo.example', count: 72, category: 'Investment & Crypto', riskLevel: 'critical' },
          { type: 'email', masked: 'ref***@fakeairline-support.com', count: 56, category: 'Fake Customer Support', riskLevel: 'critical' },
          { type: 'url', masked: 'https://incometax-***.demo.example', count: 41, category: 'Phishing', riskLevel: 'high' },
        ],
      };
    });
  }

  // ---------------- NOTIFICATIONS ----------------
  async getNotifications(): Promise<NotificationItem[]> {
    return this.request('/api/notifications', {}, () => getLocalNotifications());
  }

  async markNotificationRead(id: number): Promise<void> {
    return this.request(
      `/api/notifications/${id}/read`,
      { method: 'POST' },
      () => {
        const notifs = getLocalNotifications();
        const found = notifs.find((n) => n.id === id);
        if (found) found.readStatus = true;
        localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifs));
      }
    );
  }

  private getLocalUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export const api = new ApiService();

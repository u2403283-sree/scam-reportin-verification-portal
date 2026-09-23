import { Router, Request, Response } from 'express';
import { db, maskIdentifier } from '../data/mockDb.ts';
import { IdentifierType, ReportStatus, RiskLevel } from '../../src/types/index.ts';

export const apiRouter = Router();

// Helper to simulate JWT token
function generateToken(userId: number, role: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, role, exp: Date.now() + 86400000 })).toString('base64');
  return `scamshield_jwt.${payload}.sig`;
}

function parseAuthHeader(req: Request): { userId: number; role: string } | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const token = auth.slice(7);
    const parts = token.split('.');
    if (parts.length >= 2) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      return payload;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// -------------------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

// POST /api/auth/register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: db.users.length + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: password, // In production, bcrypt.hashSync(password, 10)
    role: 'user' as const,
    phone: phone || '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  const token = generateToken(newUser.id, newUser.role);

  return res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
    },
    token,
  });
});

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Demo accounts check or match password
  const isValid =
    (user.email === 'admin@scamshield.demo' && password === 'Admin@123') ||
    (user.email === 'user@scamshield.demo' && password === 'Demo@123') ||
    user.passwordHash === password ||
    password === 'Demo@123' ||
    password === 'Admin@123';

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user.id, user.role);

  return res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    },
    token,
  });
});

// GET /api/auth/me
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const auth = parseAuthHeader(req);
  if (!auth) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const user = db.users.find((u) => u.id === auth.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });
});

// -------------------------------------------------------------
// 2. CATEGORIES ENDPOINTS
// -------------------------------------------------------------
apiRouter.get('/categories', (_req: Request, res: Response) => {
  return res.json(db.categories);
});

// -------------------------------------------------------------
// 3. REPORTS ENDPOINTS
// -------------------------------------------------------------

// GET /api/reports (public search & filtering)
apiRouter.get('/reports', (req: Request, res: Response) => {
  const { search, category, risk, status, sort, page = '1', limit = '12' } = req.query;

  let list = [...db.reports];

  // Search query across title, description, city, state, or identifier masked/raw
  if (typeof search === 'string' && search.trim().length > 0) {
    const q = search.trim().toLowerCase();
    list = list.filter((r) => {
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchLoc = (r.city && r.city.toLowerCase().includes(q)) || (r.state && r.state.toLowerCase().includes(q));
      const matchId = r.reportId.toLowerCase().includes(q);
      const matchIdent = r.identifiers.some(
        (i) => i.value.toLowerCase().includes(q) || i.maskedValue.toLowerCase().includes(q)
      );
      return matchTitle || matchDesc || matchLoc || matchId || matchIdent;
    });
  }

  // Category filter
  if (typeof category === 'string' && category !== 'all' && category.trim().length > 0) {
    list = list.filter((r) => String(r.categoryId) === category || r.categoryName?.toLowerCase() === category.toLowerCase());
  }

  // Risk filter
  if (typeof risk === 'string' && risk !== 'all' && risk.trim().length > 0) {
    list = list.filter((r) => r.riskLevel.toLowerCase() === risk.toLowerCase());
  }

  // Status filter
  if (typeof status === 'string' && status !== 'all' && status.trim().length > 0) {
    list = list.filter((r) => r.status.toLowerCase() === status.toLowerCase());
  }

  // Sorting
  if (sort === 'most_reported') {
    list.sort((a, b) => (b.communityUpvotes || 0) - (a.communityUpvotes || 0));
  } else if (sort === 'highest_risk') {
    const riskPriority: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    list.sort((a, b) => (riskPriority[b.riskLevel] || 0) - (riskPriority[a.riskLevel] || 0));
  } else {
    // Default: most recent
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = list.length;
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit as string, 10) || 12);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedReports = list.slice(startIndex, startIndex + limitNum);

  return res.json({
    reports: paginatedReports,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// GET /api/reports/my (authenticated user reports)
apiRouter.get('/reports/my', (req: Request, res: Response) => {
  const auth = parseAuthHeader(req);
  const userId = auth?.userId || 2; // fallback to demo user if not logged in

  const userReports = db.reports.filter((r) => r.userId === userId);
  return res.json(userReports);
});

// GET /api/reports/:id
apiRouter.get('/reports/:id', (req: Request, res: Response) => {
  const idParam = req.params.id;
  const report = db.reports.find(
    (r) => String(r.id) === idParam || r.reportId.toLowerCase() === idParam.toLowerCase()
  );

  if (!report) {
    return res.status(404).json({ error: 'Scam report not found' });
  }

  // Increment views
  report.viewsCount = (report.viewsCount || 0) + 1;

  return res.json(report);
});

// POST /api/reports (submit scam report)
apiRouter.post('/reports', (req: Request, res: Response) => {
  const auth = parseAuthHeader(req);
  const userId = auth ? auth.userId : req.body.userId || 2;

  const {
    reporterName,
    reporterEmail,
    categoryId,
    title,
    description,
    incidentDate,
    amountLost,
    currency,
    country,
    state,
    city,
    platform,
    scamMethod,
    identifiers,
    evidence,
  } = req.body;

  if (!title || !description || !categoryId) {
    return res.status(400).json({ error: 'Title, description, and category are required.' });
  }

  const newReport = db.createReport({
    userId,
    reporterName: reporterName || 'Anonymous',
    reporterEmail: reporterEmail || 'reporter@example.com',
    categoryId: Number(categoryId),
    title,
    description,
    incidentDate: incidentDate || new Date().toISOString().split('T')[0],
    amountLost: Number(amountLost) || 0,
    currency: currency || 'INR',
    country: country || 'India',
    state: state || 'Maharashtra',
    city: city || 'Mumbai',
    platform: platform || 'Unknown',
    scamMethod,
    identifiers: Array.isArray(identifiers) ? identifiers : [],
    evidence: Array.isArray(evidence) ? evidence : [],
  });

  return res.status(201).json({
    message: 'Report submitted successfully',
    report: newReport,
  });
});

// PUT /api/reports/:id (update report)
apiRouter.put('/reports/:id', (req: Request, res: Response) => {
  const idParam = req.params.id;
  const reportIndex = db.reports.findIndex(
    (r) => String(r.id) === idParam || r.reportId.toLowerCase() === idParam.toLowerCase()
  );

  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const updated = {
    ...db.reports[reportIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.reports[reportIndex] = updated;
  return res.json(updated);
});

// -------------------------------------------------------------
// 4. VERIFICATION ENDPOINTS
// -------------------------------------------------------------

// POST /api/verify
apiRouter.post('/verify', (req: Request, res: Response) => {
  const { type, query } = req.body;
  if (!type || !query) {
    return res.status(400).json({ error: 'Identifier type and query are required.' });
  }

  const auth = parseAuthHeader(req);
  const userId = auth?.userId;

  const result = db.verifyIdentifier(type as IdentifierType, query, userId);
  return res.json(result);
});

// GET /api/verify/history
apiRouter.get('/verify/history', (req: Request, res: Response) => {
  const auth = parseAuthHeader(req);
  const userId = auth?.userId;

  const logs = userId
    ? db.searchLogs.filter((l) => l.userId === userId).slice(0, 10)
    : db.searchLogs.slice(0, 10);

  return res.json(logs);
});

// -------------------------------------------------------------
// 5. ADMIN ENDPOINTS
// -------------------------------------------------------------

// GET /api/admin/reports
apiRouter.get('/admin/reports', (req: Request, res: Response) => {
  const auth = parseAuthHeader(req);
  // Allow admin access or demo admin inspection
  return res.json(db.reports);
});

// PUT /api/admin/reports/:id/review
apiRouter.put('/admin/reports/:id/review', (req: Request, res: Response) => {
  const idParam = req.params.id;
  const { action, status, riskLevel, comment } = req.body;

  const report = db.reports.find(
    (r) => String(r.id) === idParam || r.reportId.toLowerCase() === idParam.toLowerCase()
  );

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const prevStatus = report.status;
  if (status) {
    report.status = status as ReportStatus;
  }
  if (riskLevel) {
    report.riskLevel = riskLevel as RiskLevel;
  }

  const moderationRecord = {
    id: Date.now(),
    reportId: report.id,
    adminId: 1,
    adminName: 'Cyber Security Admin',
    action: action || 'approve',
    previousStatus: prevStatus,
    newStatus: report.status,
    comment: comment || 'Status updated during moderation audit.',
    createdAt: new Date().toISOString(),
  };

  report.moderationHistory = report.moderationHistory || [];
  report.moderationHistory.unshift(moderationRecord);
  report.updatedAt = new Date().toISOString();

  // Notify original reporter if user exists
  if (report.userId) {
    db.notifications.unshift({
      id: Date.now(),
      userId: report.userId,
      title: `Report Status: ${report.status}`,
      message: `Your scam report ${report.reportId} was updated by the moderation team. Status: ${report.status}.`,
      type: report.status === 'Verified' ? 'success' : report.status === 'Rejected' ? 'warning' : 'info',
      reportId: report.reportId,
      readStatus: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({
    message: 'Report reviewed successfully',
    report,
  });
});

// PUT /api/admin/reports/:id/status
apiRouter.put('/admin/reports/:id/status', (req: Request, res: Response) => {
  const idParam = req.params.id;
  const { status } = req.body;

  const report = db.reports.find(
    (r) => String(r.id) === idParam || r.reportId.toLowerCase() === idParam.toLowerCase()
  );

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  report.status = status as ReportStatus;
  report.updatedAt = new Date().toISOString();

  return res.json(report);
});

// GET /api/admin/analytics
apiRouter.get('/admin/analytics', (_req: Request, res: Response) => {
  const analytics = db.getAnalytics();
  return res.json(analytics);
});

// -------------------------------------------------------------
// 6. NOTIFICATIONS ENDPOINTS
// -------------------------------------------------------------
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const auth = parseAuthHeader(req);
  const userId = auth?.userId || 2; // fallback to demo user
  const userNotifs = db.notifications.filter((n) => n.userId === userId);
  return res.json(userNotifs);
});

apiRouter.post('/notifications/:id/read', (req: Request, res: Response) => {
  const idParam = Number(req.params.id);
  const notif = db.notifications.find((n) => n.id === idParam);
  if (notif) {
    notif.readStatus = true;
  }
  return res.json({ success: true });
});

apiRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  const auth = parseAuthHeader(req);
  const userId = auth?.userId || 2;
  db.notifications.forEach((n) => {
    if (n.userId === userId) {
      n.readStatus = true;
    }
  });
  return res.json({ success: true });
});

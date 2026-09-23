import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  setLogLevel,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Report, Category, VerificationResult, ReportStatus } from '../types/index.ts';
import { initialCategories, initialReports, maskIdentifier } from '../../server/data/mockDb.ts';

// Suppress excessive internal network warnings in restricted iframe environments
setLogLevel('silent');

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore using the designated database ID from config with experimentalForceLongPolling
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);

// Initialize Firebase Auth
export const auth = getAuth(app);

// --------------------------------------------------------------------------
// Standardized Firestore Error Handler
// --------------------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --------------------------------------------------------------------------
// Connection Check
// --------------------------------------------------------------------------
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or connection issue. Please check configuration.');
    }
    return false;
  }
}

// --------------------------------------------------------------------------
// Firestore Data Operations
// --------------------------------------------------------------------------

// Seed initial reports and categories into Firestore if empty
let seedAttempted = false;
export async function seedFirestoreIfEmpty(): Promise<void> {
  if (seedAttempted) return;
  seedAttempted = true;

  try {
    const reportsCol = collection(db, 'reports');
    const snap = await getDocs(query(reportsCol, limit(1)));

    if (snap.empty) {
      console.log('Seeding initial reports into Firestore...');
      for (const rep of initialReports.slice(0, 15)) {
        const docRef = doc(db, 'reports', String(rep.id));
        await setDoc(docRef, {
          ...rep,
          id: rep.id,
          reportId: rep.reportId,
          title: rep.title,
          description: rep.description,
          categoryId: rep.categoryId,
          categoryName: rep.categoryName || 'Scam',
          incidentDate: rep.incidentDate,
          reporterName: rep.reporterName,
          reporterEmail: rep.reporterEmail,
          status: rep.status,
          identifiers: rep.identifiers || [],
          createdAt: rep.createdAt,
          updatedAt: rep.updatedAt,
        });
      }

      console.log('Seeding initial categories into Firestore...');
      for (const cat of initialCategories) {
        const catRef = doc(db, 'categories', String(cat.id));
        await setDoc(catRef, cat);
      }
      console.log('Firestore seed complete!');
    }
  } catch (err) {
    console.warn('Could not auto-seed Firestore (using existing data or fallback):', err);
  }
}

// Fetch all reports from Firestore
export async function getFirestoreReports(): Promise<Report[]> {
  try {
    await seedFirestoreIfEmpty();
    const snap = await getDocs(collection(db, 'reports'));
    if (snap.empty) {
      return [...initialReports];
    }
    const reports: Report[] = [];
    snap.forEach((d) => {
      reports.push(d.data() as Report);
    });
    return reports;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'reports');
  }
}

// Fetch a single report by ID
export async function getFirestoreReportById(id: string | number): Promise<Report | null> {
  try {
    const docRef = doc(db, 'reports', String(id));
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Report;
    }

    // Try searching by reportId field
    const q = query(collection(db, 'reports'), where('reportId', '==', String(id)), limit(1));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as Report;
    }

    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `reports/${id}`);
  }
}

// Create a new report in Firestore
export async function createFirestoreReport(reportData: Partial<Report>): Promise<Report> {
  try {
    const id = Date.now();
    const reportId = `SCAM-${new Date().getFullYear()}-${String(id).slice(-6)}`;
    const newReport: Report = {
      id,
      reportId,
      title: reportData.title || '',
      description: reportData.description || '',
      incidentDate: reportData.incidentDate || new Date().toISOString().split('T')[0],
      categoryId: reportData.categoryId || 1,
      categoryName: reportData.categoryName || 'General Scam',
      reporterName: reportData.reporterName || 'Anonymous Reporter',
      reporterEmail: reportData.reporterEmail || 'user@example.com',
      userId: reportData.userId,
      amountLost: reportData.amountLost || 0,
      currency: 'INR',
      country: 'India',
      state: 'All States',
      city: 'National',
      platform: 'Digital',
      riskLevel: 'high',
      status: 'Submitted',
      communityUpvotes: 0,
      viewsCount: 1,
      identifiers: reportData.identifiers || [],
      evidence: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = doc(db, 'reports', String(id));
    await setDoc(docRef, newReport);
    return newReport;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'reports');
  }
}

// Update report status in Firestore
export async function updateFirestoreReportStatus(id: string | number, status: ReportStatus): Promise<Report> {
  try {
    let docRef = doc(db, 'reports', String(id));
    let snap = await getDoc(docRef);

    if (!snap.exists()) {
      // Find by reportId
      const q = query(collection(db, 'reports'), where('reportId', '==', String(id)), limit(1));
      const querySnap = await getDocs(q);
      if (querySnap.empty) {
        throw new Error('Report not found');
      }
      docRef = querySnap.docs[0].ref;
      snap = querySnap.docs[0];
    }

    const currentData = snap.data() as Report;
    const updated: Report = {
      ...currentData,
      status,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, {
      status,
      updatedAt: updated.updatedAt,
    });

    return updated;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `reports/${id}`);
  }
}

// Verify an identifier against Firestore reports
export async function verifyIdentifierInFirestore(
  type: string,
  value: string
): Promise<VerificationResult> {
  try {
    await seedFirestoreIfEmpty();
    const reports = await getFirestoreReports();
    const cleanQuery = value.toLowerCase().replace(/[\s\-\(\)\+]/g, '');

    const matchingReports = reports.filter((rep) =>
      rep.identifiers?.some((ident) => {
        if (ident.type !== type) return false;
        const cleanTarget = ident.value.toLowerCase().replace(/[\s\-\(\)\+]/g, '');
        return cleanTarget.includes(cleanQuery) || cleanQuery.includes(cleanTarget);
      })
    );

    const count = matchingReports.length;
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

    const masked = maskIdentifier(type as any, value);
    const catMap: Record<string, number> = {};
    matchingReports.forEach((r) => {
      const c = r.categoryName || 'General';
      catMap[c] = (catMap[c] || 0) + 1;
    });

    return {
      identifierType: type as any,
      rawInput: value,
      maskedIdentifier: masked,
      totalReports: count,
      riskLevel,
      statusHeading,
      statusDescription,
      categories: Object.entries(catMap).map(([name, catCount]) => ({ name, count: catCount })),
      latestReports: matchingReports.slice(0, 4).map((r) => ({
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
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'reports');
  }
}


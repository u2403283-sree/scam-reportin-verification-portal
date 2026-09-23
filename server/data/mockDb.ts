import {
  User,
  Category,
  Report,
  VerificationResult,
  NotificationItem,
  VerificationSearchLog,
  AnalyticsData,
  RiskLevel,
  ReportStatus,
  IdentifierType
} from '../../src/types/index.ts';

// Initial Categories
export const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Banking & Financial Scam',
    slug: 'banking-fraud',
    description: 'Fraudulent wire transfer requests, fake bank verification calls, SIM swap, APK trojans, and phishing SMS.',
    iconName: 'Landmark',
    severityLevel: 'critical',
  },
  {
    id: 2,
    name: 'Job Scam',
    slug: 'job-scam',
    description: 'Fake work-from-home offers, YouTube like-task schemes, upfront registration fees, and fake recruiter letters.',
    iconName: 'Briefcase',
    severityLevel: 'high',
  },
  {
    id: 3,
    name: 'Investment & Crypto',
    slug: 'investment-crypto',
    description: 'Guaranteed high-return Ponzi apps, fake forex trading terminals, WhatsApp VIP wealth groups, and bogus crypto tokens.',
    iconName: 'TrendingUp',
    severityLevel: 'critical',
  },
  {
    id: 4,
    name: 'Online Shopping Fraud',
    slug: 'online-shopping',
    description: 'Fraudulent e-commerce sites selling deeply discounted electronics, fake courier tracking links, and non-delivery scams.',
    iconName: 'ShoppingBag',
    severityLevel: 'medium',
  },
  {
    id: 5,
    name: 'Phishing & Impersonation',
    slug: 'phishing',
    description: 'Spoofed login portals, credential harvesting emails, tax department notices, and fake electricity bill warnings.',
    iconName: 'Fish',
    severityLevel: 'high',
  },
  {
    id: 6,
    name: 'Social Media & Sextortion',
    slug: 'social-media',
    description: 'Compromised accounts asking friends for money, romantic catfish extortion, and impersonation of public figures.',
    iconName: 'Share2',
    severityLevel: 'high',
  },
  {
    id: 7,
    name: 'Fake Customer Support',
    slug: 'fake-support',
    description: 'Toll-free numbers advertised on search engines claiming to be airlines, courier brands, or payment gateways.',
    iconName: 'Headphones',
    severityLevel: 'high',
  },
  {
    id: 8,
    name: 'Lottery / Prize Fraud',
    slug: 'lottery-prize',
    description: 'KBC lottery SMS, scratch-card gift cards, and advance-fee courier charges for fictitious awards.',
    iconName: 'Award',
    severityLevel: 'medium',
  },
];

// Initial Users
export const initialUsers: (User & { passwordHash: string })[] = [
  {
    id: 1,
    name: 'Cyber Security Admin',
    email: 'admin@scamshield.demo',
    passwordHash: 'Admin@123', // for simulation
    role: 'admin',
    phone: '+91 98000 00001',
    createdAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 2,
    name: 'Aarav Sharma',
    email: 'user@scamshield.demo',
    passwordHash: 'Demo@123',
    role: 'user',
    phone: '+91 98000 00002',
    createdAt: '2026-08-01T12:00:00Z',
  },
  {
    id: 3,
    name: 'Priya Patel',
    email: 'priya.demo@example.com',
    passwordHash: 'Demo@123',
    role: 'user',
    phone: '+91 98000 00003',
    createdAt: '2026-08-10T14:30:00Z',
  },
  {
    id: 4,
    name: 'Rohan Mehta',
    email: 'rohan.demo@example.com',
    passwordHash: 'Demo@123',
    role: 'user',
    phone: '+91 98000 00004',
    createdAt: '2026-08-15T09:15:00Z',
  },
  {
    id: 5,
    name: 'Ananya Singh',
    email: 'ananya.demo@example.com',
    passwordHash: 'Demo@123',
    role: 'user',
    phone: '+91 98000 00005',
    createdAt: '2026-08-20T11:20:00Z',
  },
  {
    id: 6,
    name: 'Vikram Malhotra',
    email: 'vikram.demo@example.com',
    passwordHash: 'Demo@123',
    role: 'user',
    phone: '+91 98000 00006',
    createdAt: '2026-08-22T16:00:00Z',
  },
  {
    id: 7,
    name: 'Sneha Reddy',
    email: 'sneha.demo@example.com',
    passwordHash: 'Demo@123',
    role: 'user',
    phone: '+91 98000 00007',
    createdAt: '2026-08-25T18:45:00Z',
  },
];

// Helper to mask values
export function maskIdentifier(type: IdentifierType, raw: string): string {
  const clean = raw.trim();
  if (type === 'phone') {
    if (clean.length >= 10) {
      const start = clean.slice(0, 5);
      const end = clean.slice(-2);
      return `${start} XXXXX ${end}`;
    }
    return clean.slice(0, 3) + ' XXXXX';
  }
  if (type === 'email') {
    const parts = clean.split('@');
    if (parts.length === 2) {
      const name = parts[0];
      const domain = parts[1];
      const visibleName = name.length > 2 ? name.slice(0, 2) + '***' : name + '***';
      return `${visibleName}@${domain}`;
    }
    return '***@example.com';
  }
  if (type === 'url') {
    try {
      const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
      const hostParts = parsed.hostname.split('.');
      if (hostParts.length > 1) {
        const maskedHost = hostParts[0].slice(0, 4) + '***.' + hostParts.slice(1).join('.');
        return `${parsed.protocol}//${maskedHost}`;
      }
      return `${parsed.protocol}//${parsed.hostname.slice(0, 4)}***`;
    } catch {
      return clean.slice(0, 8) + '***.example';
    }
  }
  if (type === 'social') {
    return clean.slice(0, 3) + '***';
  }
  if (type === 'bank_account') {
    return clean.slice(0, 4) + '****' + clean.slice(-3);
  }
  return clean.slice(0, 4) + '***';
}

// Initial Reports (Rich real-world dataset)
export const initialReports: Report[] = [
  {
    id: 1,
    reportId: 'SCAM-2026-000124',
    userId: 2,
    reporterName: 'Aarav Sharma',
    reporterEmail: 'user@scamshield.demo',
    categoryId: 2,
    categoryName: 'Job Scam',
    title: 'Part-time Telegram YouTube Review Task Scam',
    description: 'Received a WhatsApp message offering Rs 3,000 daily for liking YouTube videos. After small initial payouts of Rs 150, they demanded Rs 45,000 for a VIP merchant tier in Telegram which could never be withdrawn.',
    incidentDate: '2026-08-14',
    amountLost: 45000,
    currency: 'INR',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    platform: 'Telegram',
    scamMethod: 'Prepaid task escalation scheme',
    riskLevel: 'high',
    status: 'Verified',
    communityUpvotes: 34,
    viewsCount: 1420,
    identifiers: [
      { id: 101, type: 'phone', value: '+919876543210', maskedValue: '+91 98765 XXXXX 10' },
      { id: 102, type: 'social', value: '@task_earning_vip', maskedValue: '@task_earning_***' },
      { id: 103, type: 'bank_account', value: '50100234981245', maskedValue: '5010****245' },
    ],
    evidence: [
      { id: 501, fileName: 'telegram_task_chat_screenshot.png', fileUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop', fileType: 'image/png', fileSizeBytes: 248000 }
    ],
    moderationHistory: [
      {
        id: 701,
        reportId: 1,
        adminId: 1,
        adminName: 'Cyber Security Admin',
        action: 'approve',
        previousStatus: 'Submitted',
        newStatus: 'Verified',
        comment: 'Verified against 34 independent community complaints regarding the same Telegram handle and phone cluster.',
        createdAt: '2026-08-15T10:00:00Z'
      }
    ],
    createdAt: '2026-08-14T08:30:00Z',
    updatedAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 2,
    reportId: 'SCAM-2026-000125',
    userId: 3,
    reporterName: 'Priya Patel',
    reporterEmail: 'priya.demo@example.com',
    categoryId: 1,
    categoryName: 'Banking & Financial Scam',
    title: 'Fake Electricity Bill Disconnection Warning SMS',
    description: 'SMS warned electricity power supply would be disconnected tonight at 9:30 PM due to unpaid bill. Provided fake officer helpline. The person insisted on installing an APK to update the meter and drained bank savings.',
    incidentDate: '2026-08-18',
    amountLost: 28500,
    currency: 'INR',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    platform: 'SMS',
    scamMethod: 'Remote desktop tool credential theft',
    riskLevel: 'critical',
    status: 'Verified',
    communityUpvotes: 48,
    viewsCount: 2410,
    identifiers: [
      { id: 104, type: 'phone', value: '+919123456780', maskedValue: '+91 91234 XXXXX 80' },
      { id: 105, type: 'url', value: 'https://powerbill-update.demo.example', maskedValue: 'https://powerbill-***.demo.example' },
    ],
    evidence: [
      { id: 502, fileName: 'sms_disconnection_threat.jpg', fileUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop', fileType: 'image/jpeg', fileSizeBytes: 185000 }
    ],
    moderationHistory: [
      {
        id: 702,
        reportId: 2,
        adminId: 1,
        adminName: 'Cyber Security Admin',
        action: 'approve',
        previousStatus: 'Submitted',
        newStatus: 'Verified',
        comment: 'High threat warning confirmed: APK contains remote access trojan that captures SMS OTPs.',
        createdAt: '2026-08-19T09:00:00Z'
      }
    ],
    createdAt: '2026-08-18T14:10:00Z',
    updatedAt: '2026-08-19T09:00:00Z',
  },
  {
    id: 3,
    reportId: 'SCAM-2026-000126',
    userId: 4,
    reporterName: 'Rohan Mehta',
    reporterEmail: 'rohan.demo@example.com',
    categoryId: 3,
    categoryName: 'Investment & Crypto',
    title: 'Fake Quantum Trading AI High-Yield Platform',
    description: 'Invited to a WhatsApp stock advisory group run by fake institutional fund managers. Deposited funds into an unverified web app showing fake compounding profits. When requesting withdrawal, demanded 30% capital tax fee.',
    incidentDate: '2026-08-21',
    amountLost: 120000,
    currency: 'INR',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    platform: 'WhatsApp',
    scamMethod: 'Fake broker terminal deposit lock',
    riskLevel: 'critical',
    status: 'Verified',
    communityUpvotes: 72,
    viewsCount: 3890,
    identifiers: [
      { id: 106, type: 'phone', value: '+919988776655', maskedValue: '+91 99887 XXXXX 55' },
      { id: 107, type: 'url', value: 'https://quantuminvest-ai.demo.example', maskedValue: 'https://quantuminvest-***.demo.example' },
      { id: 108, type: 'bank_account', value: '009801543210', maskedValue: '0098****210' },
    ],
    createdAt: '2026-08-21T18:20:00Z',
    updatedAt: '2026-08-22T11:00:00Z',
  },
  {
    id: 4,
    reportId: 'SCAM-2026-000127',
    userId: 5,
    reporterName: 'Ananya Singh',
    reporterEmail: 'ananya.demo@example.com',
    categoryId: 4,
    categoryName: 'Online Shopping Fraud',
    title: 'Boutique Designer Store 80% Clearance Scam',
    description: 'Instagram ad offered branded sneakers for Rs 1,499. Payment taken via payment gateway clone. No dispatch confirmation was received, customer care numbers are dead, and the domain disappeared.',
    incidentDate: '2026-08-25',
    amountLost: 2998,
    currency: 'INR',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    platform: 'Instagram',
    scamMethod: 'Ghost web shop checkout',
    riskLevel: 'medium',
    status: 'Verified',
    communityUpvotes: 19,
    viewsCount: 940,
    identifiers: [
      { id: 109, type: 'url', value: 'https://luxe-sneaker-clearance.demo.example', maskedValue: 'https://luxe-sneaker-***.demo.example' },
      { id: 110, type: 'social', value: '@luxe_kicks_india', maskedValue: '@luxe_***' },
      { id: 111, type: 'bank_account', value: '918820019284', maskedValue: '9188****284' },
    ],
    createdAt: '2026-08-25T11:45:00Z',
    updatedAt: '2026-08-26T15:10:00Z',
  },
  {
    id: 5,
    reportId: 'SCAM-2026-000128',
    userId: 6,
    reporterName: 'Vikram Malhotra',
    reporterEmail: 'vikram.demo@example.com',
    categoryId: 7,
    categoryName: 'Fake Customer Support',
    title: 'Fake Airline Customer Support on Google Search',
    description: 'Searched for airline ticket cancellation helpline. Called top sponsored number. The agent pretended to initiate a refund but sent an invoice of Rs 49,999 demanding immediate wire transfer.',
    incidentDate: '2026-08-29',
    amountLost: 49999,
    currency: 'INR',
    country: 'India',
    state: 'Haryana',
    city: 'Gurugram',
    platform: 'Google Search',
    scamMethod: 'SEO poisoned fake helpline and wire fraud',
    riskLevel: 'critical',
    status: 'Verified',
    communityUpvotes: 56,
    viewsCount: 1890,
    identifiers: [
      { id: 112, type: 'phone', value: '+918001234567', maskedValue: '+91 80012 XXXXX 67' },
      { id: 113, type: 'email', value: 'refunddesk.airways@fakeairline-support.com', maskedValue: 'ref***@fakeairline-support.com' },
    ],
    createdAt: '2026-08-29T16:15:00Z',
    updatedAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 6,
    reportId: 'SCAM-2026-000129',
    userId: 7,
    reporterName: 'Sneha Reddy',
    reporterEmail: 'sneha.demo@example.com',
    categoryId: 5,
    categoryName: 'Phishing & Impersonation',
    title: 'Income Tax Refund Verification Phishing Portal',
    description: 'Received SMS stating tax refund of Rs 18,540 was approved and needed bank account confirmation. The link was a carbon-copy replica of the government tax portal designed to harvest net-banking login credentials.',
    incidentDate: '2026-09-02',
    amountLost: 0,
    currency: 'INR',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    platform: 'SMS',
    scamMethod: 'Credential harvesting portal clone',
    riskLevel: 'high',
    status: 'Verified',
    communityUpvotes: 41,
    viewsCount: 1420,
    identifiers: [
      { id: 114, type: 'phone', value: '+919345678901', maskedValue: '+91 93456 XXXXX 01' },
      { id: 115, type: 'url', value: 'https://incometax-refund-portal.demo.example', maskedValue: 'https://incometax-***.demo.example' },
    ],
    createdAt: '2026-09-02T13:20:00Z',
    updatedAt: '2026-09-03T09:15:00Z',
  },
  {
    id: 7,
    reportId: 'SCAM-2026-000130',
    userId: 2,
    reporterName: 'Aarav Sharma',
    reporterEmail: 'user@scamshield.demo',
    categoryId: 2,
    categoryName: 'Job Scam',
    title: 'Data Entry Software Security Deposit Extortion',
    description: 'Offered remote copy-paste typing job with Rs 25,000 monthly stipend. Asked for Rs 3,500 refundable software activation charge. After paying, accused me of spelling errors and threatened legal police action unless Rs 5,000 penalty was paid.',
    incidentDate: '2026-09-05',
    amountLost: 8500,
    currency: 'INR',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Noida',
    platform: 'Email',
    scamMethod: 'Advance fee & extortion threat',
    riskLevel: 'high',
    status: 'Under Review',
    communityUpvotes: 14,
    viewsCount: 620,
    identifiers: [
      { id: 116, type: 'email', value: 'recruitment.hr@globalworkonline.demo.example', maskedValue: 'rec***@globalworkonline.demo.example' },
      { id: 117, type: 'phone', value: '+919456781234', maskedValue: '+91 94567 XXXXX 34' },
    ],
    createdAt: '2026-09-05T15:40:00Z',
    updatedAt: '2026-09-06T12:00:00Z',
  },
  {
    id: 8,
    reportId: 'SCAM-2026-000131',
    userId: 3,
    reporterName: 'Priya Patel',
    reporterEmail: 'priya.demo@example.com',
    categoryId: 6,
    categoryName: 'Social Media & Sextortion',
    title: 'Compromised Instagram Account Friend Medical Emergency',
    description: 'Received urgent DMs from an old school friend claiming their sibling was hospitalized and needed Rs 15,000 immediately via GPay. Later called the actual friend who stated their Instagram account was hacked.',
    incidentDate: '2026-09-07',
    amountLost: 15000,
    currency: 'INR',
    country: 'India',
    state: 'Kerala',
    city: 'Kochi',
    platform: 'Instagram',
    scamMethod: 'Account takeover social engineering',
    riskLevel: 'medium',
    status: 'Verified',
    communityUpvotes: 23,
    viewsCount: 780,
    identifiers: [
      { id: 118, type: 'social', value: '@rahul_traveler_official', maskedValue: '@rahul_***' },
      { id: 119, type: 'bank_account', value: '982001458921', maskedValue: '9820****921' },
    ],
    createdAt: '2026-09-07T19:30:00Z',
    updatedAt: '2026-09-08T11:20:00Z',
  },
  {
    id: 9,
    reportId: 'SCAM-2026-000132',
    userId: 4,
    reporterName: 'Rohan Mehta',
    reporterEmail: 'rohan.demo@example.com',
    categoryId: 1,
    categoryName: 'Banking & Financial Scam',
    title: 'Credit Card Reward Points Expiry Vishing Call',
    description: 'Fraudster called impersonating bank card rewards division stating reward points worth Rs 4,100 were expiring today. Sent a link to redeem that triggered unauthorized net banking debit.',
    incidentDate: '2026-09-10',
    amountLost: 32000,
    currency: 'INR',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    platform: 'Direct Call',
    scamMethod: 'Vishing and OTP interception',
    riskLevel: 'critical',
    status: 'Verified',
    communityUpvotes: 29,
    viewsCount: 990,
    identifiers: [
      { id: 120, type: 'phone', value: '+919765432198', maskedValue: '+91 97654 XXXXX 98' },
      { id: 121, type: 'url', value: 'https://hdfc-reward-redeem.demo.example', maskedValue: 'https://hdfc-reward-***.demo.example' },
    ],
    createdAt: '2026-09-10T10:15:00Z',
    updatedAt: '2026-09-11T09:40:00Z',
  },
  {
    id: 10,
    reportId: 'SCAM-2026-000133',
    userId: 5,
    reporterName: 'Ananya Singh',
    reporterEmail: 'ananya.demo@example.com',
    categoryId: 8,
    categoryName: 'Lottery / Prize Fraud',
    title: 'Postal Scratch Card Lucky Winner Advance Customs Fee',
    description: 'Received formal postal letter with corporate logos declaring a prize of an SUV car or cash worth Rs 12.8 Lakhs. Demanded Rs 12,500 advance tax clearance fee sent to an individual savings account.',
    incidentDate: '2026-09-12',
    amountLost: 12500,
    currency: 'INR',
    country: 'India',
    state: 'West Bengal',
    city: 'Kolkata',
    platform: 'Courier Letter',
    scamMethod: 'Advance fee postal lottery scam',
    riskLevel: 'medium',
    status: 'Verified',
    communityUpvotes: 15,
    viewsCount: 540,
    identifiers: [
      { id: 122, type: 'phone', value: '+919654321876', maskedValue: '+91 96543 XXXXX 76' },
      { id: 123, type: 'bank_account', value: 'SBIN00045892110293', maskedValue: 'SBIN0004589****293' },
    ],
    createdAt: '2026-09-12T14:50:00Z',
    updatedAt: '2026-09-13T10:05:00Z',
  },
  {
    id: 11,
    reportId: 'SCAM-2026-000134',
    userId: 2,
    reporterName: 'Aarav Sharma',
    reporterEmail: 'user@scamshield.demo',
    categoryId: 4,
    categoryName: 'Online Shopping Fraud',
    title: 'Refurbished Electronics Ghost Checkout Portal',
    description: 'Ordered refurbished iPad from a sponsored deal site tech-clearancedeals.demo. The payment was processed but no receipt arrived and phone support numbers gave invalid tone.',
    incidentDate: '2026-09-15',
    amountLost: 18000,
    currency: 'INR',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    platform: 'Website',
    scamMethod: 'Fake discount store checkout',
    riskLevel: 'high',
    status: 'Under Review',
    communityUpvotes: 8,
    viewsCount: 310,
    identifiers: [
      { id: 124, type: 'url', value: 'https://tech-clearancedeals.demo.example', maskedValue: 'https://tech-clearancedeals.***.example' },
      { id: 125, type: 'phone', value: '+919234567812', maskedValue: '+91 92345 XXXXX 12' },
    ],
    createdAt: '2026-09-15T11:25:00Z',
    updatedAt: '2026-09-16T14:30:00Z',
  },
  {
    id: 12,
    reportId: 'SCAM-2026-000135',
    userId: 6,
    reporterName: 'Vikram Malhotra',
    reporterEmail: 'vikram.demo@example.com',
    categoryId: 3,
    categoryName: 'Investment & Crypto',
    title: 'Automated Crypto Arbitrage Bot 3% Daily Yield Scam',
    description: 'Promised 3% guaranteed daily returns via arbitrage bot. When attempting to withdraw, customer support demanded another 20% anti-money-laundering audit deposit.',
    incidentDate: '2026-09-16',
    amountLost: 75000,
    currency: 'INR',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    platform: 'Telegram',
    scamMethod: 'Pig butchering Ponzi smart contract',
    riskLevel: 'critical',
    status: 'Submitted',
    communityUpvotes: 5,
    viewsCount: 230,
    identifiers: [
      { id: 126, type: 'url', value: 'https://smartarbitrage-yield.demo.example', maskedValue: 'https://smartarbitrage-***.demo.example' },
      { id: 127, type: 'social', value: '@cryptowhales_admin', maskedValue: '@cryptowhales_***' },
    ],
    createdAt: '2026-09-16T17:00:00Z',
    updatedAt: '2026-09-16T17:00:00Z',
  },
];

// In-Memory Database Store Class
class MockDatabase {
  users = [...initialUsers];
  categories = [...initialCategories];
  reports = [...initialReports];
  notifications: NotificationItem[] = [
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
      message: 'A phone number you verified (+91 98765 XXXXX) was recently flagged in 8 new reports.',
      type: 'warning',
      readStatus: false,
      createdAt: '2026-09-20T14:00:00Z',
    },
    {
      id: 3,
      userId: 2,
      title: 'Report Submitted',
      message: 'Your report SCAM-2026-000134 was received and is currently under review.',
      type: 'info',
      reportId: 'SCAM-2026-000134',
      readStatus: true,
      createdAt: '2026-09-15T11:25:00Z',
    },
  ];
  searchLogs: VerificationSearchLog[] = [
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
    {
      id: 3,
      userId: 2,
      identifierType: 'bank_account',
      identifierValue: '50100234981245',
      maskedValue: '5010****245',
      resultStatus: 'suspicious',
      reportsMatched: 5,
      searchedAt: '2026-09-19T08:20:00Z',
    }
  ];

  nextReportSequence = 136;

  // Verification Search Logic (step 18)
  verifyIdentifier(type: IdentifierType, query: string, userId?: number): VerificationResult {
    const rawClean = query.trim();
    const normalized = rawClean.toLowerCase().replace(/[\s\-\(\)]/g, '');

    // Search in report identifiers
    const matchedReports: Report[] = [];

    this.reports.forEach((rep) => {
      const match = rep.identifiers.some((ident) => {
        const idNorm = ident.value.toLowerCase().replace(/[\s\-\(\)]/g, '');
        if (type === 'phone') {
          // match last 8 or 10 digits
          const last8 = normalized.slice(-8);
          return last8.length >= 7 && idNorm.includes(last8);
        }
        if (type === 'email') {
          return idNorm === normalized || idNorm.includes(normalized) || normalized.includes(idNorm);
        }
        if (type === 'url') {
          const domain = normalized.replace(/^https?:\/\//, '').split('/')[0];
          return idNorm.includes(domain) || domain.includes(idNorm.replace(/^https?:\/\//, '').split('/')[0]);
        }
        if (type === 'social') {
          const handle = normalized.replace(/^@/, '');
          return idNorm.includes(handle);
        }
        return idNorm.includes(normalized);
      });

      if (match) {
        matchedReports.push(rep);
      }
    });

    const totalCount = matchedReports.length;
    let riskLevel: 'safe' | 'low' | 'suspicious' | 'high' | 'critical' = 'safe';
    let statusHeading = 'No Prior Scam Reports Found';
    let statusDescription = 'No scam reports are currently registered in our database for this identifier.';
    let recommendedAction = 'Always verify unfamiliar payment requests independently with official contacts.';

    if (totalCount === 0) {
      riskLevel = 'safe';
      statusHeading = 'No Community Reports Found';
      statusDescription = 'No reports currently match this identifier in our community database. However, newly created fraudulent accounts or websites may not yet have been submitted.';
      recommendedAction = 'Proceed with usual digital safety vigilance. Never share banking OTPs, PINs, or install remote access apps.';
    } else if (totalCount <= 2) {
      riskLevel = 'low';
      statusHeading = 'Limited Community Reports';
      statusDescription = `Found ${totalCount} report(s) referencing this identifier. This is a low community indicator but warrants caution.`;
      recommendedAction = 'Double-check caller credentials. Ask for official verifiable proof before paying.';
    } else if (totalCount <= 5) {
      riskLevel = 'suspicious';
      statusHeading = 'Suspicious Identifier Flagged';
      statusDescription = `Multiple community members (${totalCount} reports) have reported suspicious activity linked to this identifier.`;
      recommendedAction = 'High caution advised. Avoid clicking links, downloading files, or sending advance payments.';
    } else {
      riskLevel = 'critical';
      statusHeading = 'High Risk — Frequently Reported Identifier';
      statusDescription = `This identifier is associated with ${totalCount} documented scam reports in our national community database.`;
      recommendedAction = 'DO NOT PROCEED with any transaction. Block this contact, preserve screenshots, and file a formal report.';
    }

    const masked = maskIdentifier(type, rawClean);

    // Categories breakdown
    const catMap: Record<string, number> = {};
    matchedReports.forEach((r) => {
      const cname = r.categoryName || 'General';
      catMap[cname] = (catMap[cname] || 0) + 1;
    });
    const categoriesList = Object.entries(catMap).map(([name, count]) => ({ name, count }));

    const latestReportsList = matchedReports.slice(0, 4).map((r) => ({
      id: r.id,
      reportId: r.reportId,
      title: r.title,
      categoryName: r.categoryName || 'General',
      riskLevel: r.riskLevel,
      incidentDate: r.incidentDate,
      city: r.city,
      state: r.state,
    }));

    // Record search log
    let resultStatus: 'no_reports' | 'limited' | 'suspicious' | 'frequently_reported' = 'no_reports';
    if (totalCount === 0) resultStatus = 'no_reports';
    else if (totalCount <= 2) resultStatus = 'limited';
    else if (totalCount <= 5) resultStatus = 'suspicious';
    else resultStatus = 'frequently_reported';

    this.searchLogs.unshift({
      id: Date.now(),
      userId,
      identifierType: type,
      identifierValue: rawClean,
      maskedValue: masked,
      resultStatus,
      reportsMatched: totalCount,
      searchedAt: new Date().toISOString(),
    });

    return {
      identifierType: type,
      rawInput: rawClean,
      maskedIdentifier: masked,
      totalReports: totalCount,
      riskLevel,
      statusHeading,
      statusDescription,
      categories: categoriesList,
      latestReports: latestReportsList,
      disclaimer:
        'ScamShield is a community reporting and risk evaluation intelligence platform. Absence of reports in our database does not guarantee safety, nor does the presence of community complaints constitute a definitive judicial verdict. Always exercise independent diligence.',
      recommendedAction,
    };
  }

  // Create Report
  createReport(data: {
    userId?: number;
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
  }): Report {
    this.nextReportSequence++;
    const reportSeq = String(this.nextReportSequence).padStart(6, '0');
    const reportId = `SCAM-2026-${reportSeq}`;

    const cat = this.categories.find((c) => c.id === Number(data.categoryId));
    const categoryName = cat ? cat.name : 'Other Scam';

    const normalizedIdentifiers = data.identifiers.map((ident, idx) => ({
      id: Date.now() + idx,
      type: ident.type,
      value: ident.value.trim(),
      maskedValue: maskIdentifier(ident.type, ident.value),
    }));

    // Derive risk level
    let riskLevel: RiskLevel = 'medium';
    if (data.amountLost > 50000) riskLevel = 'critical';
    else if (data.amountLost > 10000 || cat?.severityLevel === 'critical') riskLevel = 'high';
    else if (data.amountLost > 0) riskLevel = 'medium';
    else riskLevel = 'low';

    const newReport: Report = {
      id: this.reports.length + 1,
      reportId,
      userId: data.userId,
      reporterName: data.reporterName || 'Anonymous Citizen',
      reporterEmail: data.reporterEmail,
      categoryId: Number(data.categoryId),
      categoryName,
      title: data.title,
      description: data.description,
      incidentDate: data.incidentDate,
      amountLost: Number(data.amountLost) || 0,
      currency: data.currency || 'INR',
      country: data.country || 'India',
      state: data.state || 'Maharashtra',
      city: data.city || 'Mumbai',
      platform: data.platform || 'Unknown',
      scamMethod: data.scamMethod || 'Direct outreach',
      riskLevel,
      status: 'Submitted',
      communityUpvotes: 1,
      viewsCount: 1,
      identifiers: normalizedIdentifiers,
      evidence: data.evidence?.map((e, i) => ({ id: Date.now() + i, ...e })),
      moderationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.reports.unshift(newReport);

    // If submitted by user, add notification
    if (data.userId) {
      this.notifications.unshift({
        id: Date.now(),
        userId: data.userId,
        title: 'Scam Report Submitted',
        message: `Your scam report ${reportId} has been submitted successfully and queued for review.`,
        type: 'info',
        reportId,
        readStatus: false,
        createdAt: new Date().toISOString(),
      });
    }

    return newReport;
  }

  // Analytics Computation
  getAnalytics(): AnalyticsData {
    const totalReports = this.reports.length;
    const totalUsers = this.users.length;
    const verifiedReports = this.reports.filter((r) => r.status === 'Verified').length;
    const pendingReviews = this.reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
    const rejectedReports = this.reports.filter((r) => r.status === 'Rejected').length;
    const highRiskReports = this.reports.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical').length;
    const totalAmountLost = this.reports.reduce((sum, r) => sum + (r.amountLost || 0), 0);

    // Reports by Category
    const catCounts: Record<string, number> = {};
    this.reports.forEach((r) => {
      const c = r.categoryName || 'Other';
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
    const reportsByCategory = Object.entries(catCounts).map(([name, count]) => ({
      name,
      count,
      percentage: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0,
    }));

    // Risk distribution
    const riskCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    this.reports.forEach((r) => {
      riskCounts[r.riskLevel] = (riskCounts[r.riskLevel] || 0) + 1;
    });
    const riskColors: Record<string, string> = {
      low: '#10b981', // emerald
      medium: '#0ea5e9', // cyan
      high: '#f59e0b', // amber
      critical: '#ef4444', // red
    };
    const riskDistribution = Object.entries(riskCounts).map(([name, count]) => ({
      name: name.toUpperCase(),
      count,
      color: riskColors[name] || '#64748b',
    }));

    // Reports over time (monthly)
    const reportsOverTime = [
      { month: 'Apr', reports: 12, lossInThousands: 140 },
      { month: 'May', reports: 19, lossInThousands: 280 },
      { month: 'Jun', reports: 24, lossInThousands: 360 },
      { month: 'Jul', reports: 31, lossInThousands: 490 },
      { month: 'Aug', reports: 42, lossInThousands: 720 },
      { month: 'Sep', reports: 56, lossInThousands: 945 },
    ];

    // Reports by Location
    const locCounts: Record<string, number> = {};
    this.reports.forEach((r) => {
      if (r.state) {
        locCounts[r.state] = (locCounts[r.state] || 0) + 1;
      }
    });
    const reportsByLocation = Object.entries(locCounts)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Top Reported Identifiers
    const topReportedIdentifiers = [
      { type: 'phone' as IdentifierType, masked: '+91 98765 XXXXX 10', count: 34, category: 'Job Scam', riskLevel: 'high' as RiskLevel },
      { type: 'phone' as IdentifierType, masked: '+91 91234 XXXXX 80', count: 48, category: 'Banking & Financial', riskLevel: 'critical' as RiskLevel },
      { type: 'url' as IdentifierType, masked: 'https://quantuminvest-***.demo.example', count: 72, category: 'Investment & Crypto', riskLevel: 'critical' as RiskLevel },
      { type: 'email' as IdentifierType, masked: 'ref***@fakeairline-support.com', count: 56, category: 'Fake Customer Support', riskLevel: 'critical' as RiskLevel },
      { type: 'url' as IdentifierType, masked: 'https://incometax-***.demo.example', count: 41, category: 'Phishing', riskLevel: 'high' as RiskLevel },
    ];

    return {
      totalReports,
      totalUsers,
      verifiedReports,
      pendingReviews,
      rejectedReports,
      highRiskReports,
      totalAmountLost,
      reportsByCategory,
      reportsOverTime,
      riskDistribution,
      reportsByLocation,
      topReportedIdentifiers,
    };
  }
}

export const db = new MockDatabase();

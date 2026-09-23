-- ==========================================================
-- SCAMSHIELD: Seed Data Script
-- Fictional dataset for testing, demos, and evaluation
-- ==========================================================

-- Clean existing data
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE verification_searches CASCADE;
TRUNCATE TABLE moderation_actions CASCADE;
TRUNCATE TABLE report_evidence CASCADE;
TRUNCATE TABLE report_identifiers CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;

-- 1. USERS (bcrypt hashes for 'Demo@123' and 'Admin@123')
INSERT INTO users (id, name, email, password_hash, role, phone, created_at) VALUES
(1, 'Cyber Admin', 'admin@scamshield.demo', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '+91 98000 00001', NOW() - INTERVAL '60 days'),
(2, 'Aarav Sharma', 'user@scamshield.demo', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00002', NOW() - INTERVAL '45 days'),
(3, 'Priya Patel', 'priya.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00003', NOW() - INTERVAL '30 days'),
(4, 'Rohan Mehta', 'rohan.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00004', NOW() - INTERVAL '28 days'),
(5, 'Ananya Singh', 'ananya.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00005', NOW() - INTERVAL '25 days'),
(6, 'Vikram Malhotra', 'vikram.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00006', NOW() - INTERVAL '22 days'),
(7, 'Sneha Reddy', 'sneha.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00007', NOW() - INTERVAL '20 days'),
(8, 'Karan Verma', 'karan.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00008', NOW() - INTERVAL '18 days'),
(9, 'Neha Nair', 'neha.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00009', NOW() - INTERVAL '15 days'),
(10, 'Devendra Joshi', 'devendra.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00010', NOW() - INTERVAL '12 days'),
(11, 'Meera Sen', 'meera.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00011', NOW() - INTERVAL '10 days'),
(12, 'Sanjay Kumar', 'sanjay.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00012', NOW() - INTERVAL '8 days'),
(13, 'Divya Das', 'divya.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00013', NOW() - INTERVAL '6 days'),
(14, 'Aditya Roy', 'aditya.demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '+91 98000 00014', NOW() - INTERVAL '4 days'),
(15, 'Moderator Alex', 'mod@scamshield.demo', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moderator', '+91 98000 00015', NOW() - INTERVAL '50 days');

SELECT setval('users_id_seq', 15);

-- 2. CATEGORIES
INSERT INTO categories (id, name, slug, description, icon_name, severity_level) VALUES
(1, 'Banking & Financial Scam', 'banking-fraud', 'Fraudulent wire transfer requests, fake bank verification calls, SIM swap, APK trojans, and phishing SMS.', 'Landmark', 'critical'),
(2, 'Job Scam', 'job-scam', 'Fake work-from-home offers, YouTube like-task schemes, upfront registration fees, and fake recruiter letters.', 'Briefcase', 'high'),
(3, 'Investment & Crypto', 'investment-crypto', 'Guaranteed high-return Ponzi apps, fake forex trading terminals, WhatsApp VIP wealth groups, and bogus crypto tokens.', 'TrendingUp', 'critical'),
(4, 'Online Shopping Fraud', 'online-shopping', 'Fraudulent e-commerce sites selling deeply discounted electronics, fake courier tracking links, and non-delivery scams.', 'ShoppingBag', 'medium'),
(5, 'Phishing & Impersonation', 'phishing', 'Spoofed login portals, credential harvesting emails, tax department notices, and fake electricity bill warnings.', 'Fish', 'high'),
(6, 'Social Media & Sextortion', 'social-media', 'Compromised accounts asking friends for money, romantic catfish extortion, and impersonation of public figures.', 'Share2', 'high'),
(7, 'Fake Customer Support', 'fake-support', 'Toll-free numbers advertised on search engines claiming to be airlines, courier brands, or payment gateways.', 'Headphones', 'high'),
(8, 'Lottery / Prize Fraud', 'lottery-prize', 'KBC lottery SMS, scratch-card gift cards, and advance-fee courier charges for fictitious awards.', 'Award', 'medium');

SELECT setval('categories_id_seq', 8);

-- 3. REPORTS
INSERT INTO reports (id, report_id, user_id, reporter_name, reporter_email, category_id, title, description, incident_date, amount_lost, currency, country, state, city, platform, scam_method, risk_level, status, community_upvotes, views_count, created_at) VALUES
(1, 'SCAM-2026-000124', 2, 'Aarav Sharma', 'user@scamshield.demo', 2, 'Part-time Telegram YouTube Review Task Scam', 'Received a WhatsApp message offering Rs 3,000 daily for liking YouTube videos. After small initial payouts, they demanded Rs 45,000 for a VIP merchant tier in Telegram.', '2026-08-14', 45000.00, 'INR', 'India', 'Maharashtra', 'Mumbai', 'Telegram', 'Prepaid task escalation scheme', 'high', 'Verified', 34, 1280, NOW() - INTERVAL '35 days'),
(2, 'SCAM-2026-000125', 3, 'Priya Patel', 'priya.demo@example.com', 1, 'Fake Electricity Bill Disconnection Warning SMS', 'SMS warned electricity would be disconnected tonight. Gave a helpline number. Person insisted on installing AnyDesk quick-support app to pay a Rs 10 pending surcharge.', '2026-08-18', 28500.00, 'INR', 'India', 'Gujarat', 'Ahmedabad', 'SMS', 'Remote desktop tool credential theft', 'critical', 'Verified', 48, 2410, NOW() - INTERVAL '31 days'),
(3, 'SCAM-2026-000126', 4, 'Rohan Mehta', 'rohan.demo@example.com', 3, 'Fake Quantum Trading AI High-Yield Platform', 'Joined a WhatsApp stock advisory group run by fake institutional investors. Deposited funds into an unverified portal app that showed fake compounding profits.', '2026-08-21', 120000.00, 'INR', 'India', 'Delhi', 'New Delhi', 'WhatsApp', 'Fake broker terminal deposit lock', 'critical', 'Verified', 72, 3890, NOW() - INTERVAL '28 days'),
(4, 'SCAM-2026-000127', 5, 'Ananya Singh', 'ananya.demo@example.com', 4, 'Boutique Designer Store 80% Clearance Scam', 'Instagram ad offered branded sneakers for Rs 1,499. Payment taken via payment checkout. No dispatch confirmation, order tracking was non-existent and page vanished.', '2026-08-25', 2998.00, 'INR', 'India', 'Karnataka', 'Bengaluru', 'Instagram', 'Ghost web shop checkout', 'medium', 'Verified', 19, 940, NOW() - INTERVAL '24 days'),
(5, 'SCAM-2026-000128', 6, 'Vikram Malhotra', 'vikram.demo@example.com', 7, 'Fake Indigo Airline Customer Care on Search Engine', 'Searched for airline baggage refund helpline. Called top sponsored phone number. Fraudster sent an invoice of Rs 49,999 demanding instant bank transfer.', '2026-08-29', 49999.00, 'INR', 'India', 'Haryana', 'Gurugram', 'Google Search', 'SEO poisoned fake helpline and wire fraud', 'critical', 'Verified', 56, 1890, NOW() - INTERVAL '20 days'),
(6, 'SCAM-2026-000129', 7, 'Sneha Reddy', 'sneha.demo@example.com', 5, 'Income Tax Refund Verification Phishing SMS', 'Received SMS with link claiming tax refund of Rs 18,540 was approved. Link directed to a clone of the e-filing portal asking for bank card details and OTP.', '2026-09-02', 0.00, 'INR', 'India', 'Telangana', 'Hyderabad', 'SMS', 'Credential harvesting portal clone', 'high', 'Verified', 41, 1420, NOW() - INTERVAL '16 days'),
(7, 'SCAM-2026-000130', 8, 'Karan Verma', 'karan.demo@example.com', 2, 'Data Entry Job Security Deposit Fraud', 'Offered typing work with Rs 25,000 monthly pay. Asked for refundable software registration fee of Rs 3,500. After payment, sent legal threat claiming breach of contract.', '2026-09-05', 8500.00, 'INR', 'India', 'Uttar Pradesh', 'Noida', 'Email', 'Advance fee & extortion threat', 'high', 'Under Review', 12, 620, NOW() - INTERVAL '13 days'),
(8, 'SCAM-2026-000131', 9, 'Neha Nair', 'neha.demo@example.com', 6, 'Instagram Friend Urgent Hospital Emergency Request', 'Close college friend account was compromised. Fraudster messaged requesting Rs 15,000 urgently via GPay for immediate emergency ICU admission.', '2026-09-07', 15000.00, 'INR', 'India', 'Kerala', 'Kochi', 'Instagram', 'Account takeover social engineering', 'medium', 'Verified', 23, 780, NOW() - INTERVAL '11 days'),
(9, 'SCAM-2026-000132', 10, 'Devendra Joshi', 'devendra.demo@example.com', 1, 'Fake Credit Card Reward Points Expiry Portal', 'Caller posed as bank card division stating 8,200 reward points worth Rs 4,100 expiring today. Provided a link to redeem that triggered unauthorized net banking debit.', '2026-09-10', 32000.00, 'INR', 'India', 'Rajasthan', 'Jaipur', 'Direct Call', 'Vishing and OTP interception', 'critical', 'Verified', 29, 990, NOW() - INTERVAL '8 days'),
(10, 'SCAM-2026-000133', 11, 'Meera Sen', 'meera.demo@example.com', 8, 'Lucky Draw Prize Courier Clearance Fee', 'Received letter with luxury brand logo claiming a winner of SUV car or cash alternative. Asked for Rs 12,500 customs registration charge to bank account.', '2026-09-12', 12500.00, 'INR', 'India', 'West Bengal', 'Kolkata', 'Courier Letter', 'Advance fee postal lottery scam', 'medium', 'Verified', 15, 540, NOW() - INTERVAL '6 days'),
(11, 'SCAM-2026-000134', 2, 'Aarav Sharma', 'user@scamshield.demo', 4, 'Refurbished Electronics Outlet Non-Delivery', 'Ordered an iPad for Rs 18,000 from a sponsored site tech-clearancedeals.demo. Customer care phone went dead right after payment confirmation was issued.', '2026-09-15', 18000.00, 'INR', 'India', 'Maharashtra', 'Pune', 'Website', 'Fake discount store checkout', 'high', 'Under Review', 8, 310, NOW() - INTERVAL '3 days'),
(12, 'SCAM-2026-000135', 12, 'Sanjay Kumar', 'sanjay.demo@example.com', 3, 'Crypto Staking Bot with 3% Daily Yield', 'Promised 3% daily guaranteed returns via automated arbitrage bot. Withdrawals disabled citing anti-money laundering audit unless an extra 20% deposit was made.', '2026-09-16', 75000.00, 'INR', 'India', 'Tamil Nadu', 'Chennai', 'Telegram', 'Pig butchering Ponzi smart contract', 'critical', 'Submitted', 5, 230, NOW() - INTERVAL '2 days'),
(13, 'SCAM-2026-000136', 13, 'Divya Das', 'divya.demo@example.com', 7, 'Fake Courier KYC Delivery Pending Link', 'Delivery agent impersonator asked to pay Rs 5 online for address correction via a malicious WebAPK link that installed an SMS spy Trojan.', '2026-09-18', 64000.00, 'INR', 'India', 'Odisha', 'Bhubaneswar', 'SMS', 'Malicious APK payload for SMS forwarding', 'critical', 'Under Review', 11, 420, NOW() - INTERVAL '1 day'),
(14, 'SCAM-2026-000137', 14, 'Aditya Roy', 'aditya.demo@example.com', 5, 'Netflix Subscription Renewal Failed Phishing', 'Email claiming Netflix subscription was suspended due to billing error. Link led to replica site asking for credit card number, CVV, and OTP.', '2026-09-19', 0.00, 'INR', 'India', 'Chandigarh', 'Chandigarh', 'Email', 'Subscription phishing clone', 'medium', 'Verified', 18, 590, NOW() - INTERVAL '18 hours'),
(15, 'SCAM-2026-000138', 3, 'Priya Patel', 'priya.demo@example.com', 1, 'Fake Fastag Recharge Toll Helpline', 'Called toll helpline found on web forum to dispute double deduction. Caller asked to click link on WhatsApp that initiated screen share.', '2026-09-20', 14200.00, 'INR', 'India', 'Gujarat', 'Surat', 'WhatsApp', 'Screen sharing app exploitation', 'high', 'Submitted', 3, 110, NOW() - INTERVAL '6 hours');

SELECT setval('reports_id_seq', 15);

-- 4. REPORT IDENTIFIERS (Normalized lookup entries with clean masking)
INSERT INTO report_identifiers (report_id, type, value, masked_value) VALUES
(1, 'phone', '+919876543210', '+91 98765 XXXXX'),
(1, 'social', '@task_earning_vip', '@task_earning_***'),
(1, 'bank_account', '50100234981245', '5010****245'),

(2, 'phone', '+919123456780', '+91 91234 XXXXX'),
(2, 'url', 'https://powerbill-update.demo.example', 'https://powerbill-update.demo.***'),

(3, 'phone', '+919988776655', '+91 99887 XXXXX'),
(3, 'url', 'https://quantuminvest-ai.demo.example', 'https://quantuminvest-ai.demo.***'),
(3, 'bank_account', '009801543210', '0098****210'),

(4, 'url', 'https://luxe-sneaker-clearance.demo.example', 'https://luxe-sneaker-***.example'),
(4, 'social', '@luxe_kicks_india', '@luxe_kicks_***'),
(4, 'bank_account', '918820019284', '9188****284'),

(5, 'phone', '+918001234567', '+91 80012 XXXXX'),
(5, 'email', 'refunddesk.airways@fakeairline-support.com', 'refunddesk.***@fakeairline-support.com'),

(6, 'phone', '+919345678901', '+91 93456 XXXXX'),
(6, 'url', 'https://incometax-refund-portal.demo.example', 'https://incometax-refund-***.example'),

(7, 'email', 'recruitment.hr@globalworkonline.demo.example', 'recruitment.***@globalworkonline.demo.***'),
(7, 'phone', '+919456781234', '+91 94567 XXXXX'),

(8, 'social', '@rahul_traveler_official', '@rahul_traveler_***'),
(8, 'bank_account', '982001458921', '9820****921'),

(9, 'phone', '+919765432198', '+91 97654 XXXXX'),
(9, 'url', 'https://hdfc-reward-redeem.demo.example', 'https://hdfc-reward-***.example'),

(10, 'phone', '+919654321876', '+91 96543 XXXXX'),
(10, 'bank_account', 'SBIN00045892110293', 'SBIN0004589****293'),

(11, 'url', 'https://tech-clearancedeals.demo.example', 'https://tech-clearancedeals.demo.***'),
(11, 'phone', '+919234567812', '+91 92345 XXXXX'),

(12, 'url', 'https://smartarbitrage-yield.demo.example', 'https://smartarbitrage-***.example'),
(12, 'social', '@cryptowhales_admin', '@cryptowhales_***'),

(13, 'phone', '+919112233445', '+91 91122 XXXXX'),
(13, 'url', 'https://fast-courier-kyc.demo.example/update.apk', 'https://fast-courier-***.apk'),

(14, 'email', 'billing-notice@netflix-supportalert.demo.example', 'billing-notice@***.demo.example'),
(14, 'url', 'https://netflix-account-reactivate.demo.example', 'https://netflix-account-***.example'),

(15, 'phone', '+919556677889', '+91 95566 XXXXX'),
(15, 'bank_account', '982005432110', '9820****110');

-- 5. REPORT EVIDENCE SAMPLES
INSERT INTO report_evidence (report_id, file_name, file_url, file_type, file_size_bytes) VALUES
(1, 'telegram_task_chat_screenshot.png', '/evidence/demo_evidence_1.png', 'image/png', 248000),
(2, 'sms_disconnection_threat.jpg', '/evidence/demo_evidence_2.jpg', 'image/jpeg', 185000),
(3, 'fake_crypto_deposit_receipt.pdf', '/evidence/demo_evidence_3.pdf', 'application/pdf', 524000),
(5, 'google_search_fake_number_ad.png', '/evidence/demo_evidence_4.png', 'image/png', 312000),
(6, 'spoofed_incometax_sms.png', '/evidence/demo_evidence_5.png', 'image/png', 194000);

-- 6. MODERATION ACTIONS
INSERT INTO moderation_actions (report_id, admin_id, action, previous_status, new_status, comment) VALUES
(1, 1, 'approve', 'Submitted', 'Verified', 'Evidence confirmed cross-matching 34 independent citizen complaints regarding the same Telegram task cluster.'),
(2, 1, 'approve', 'Submitted', 'Verified', 'Critical risk confirmed: Remote desktop apk package detected on associated domain.'),
(3, 1, 'approve', 'Submitted', 'Verified', 'Confirmed fake trading terminal domain with multiple high-value complaints.'),
(7, 1, 'request_info', 'Submitted', 'Additional Information Required', 'Requested screenshot of the employment contract agreement to complete verification audit.'),
(11, 1, 'change_risk', 'Submitted', 'Under Review', 'Escalated severity assessment to High Risk based on recurring ghost merchant domain.');

-- 7. VERIFICATION SEARCH LOGS
INSERT INTO verification_searches (user_id, identifier_type, identifier_value, result_status, reports_matched) VALUES
(2, 'phone', '+919876543210', 'frequently_reported', 14),
(2, 'url', 'https://quantuminvest-ai.demo.example', 'suspicious', 6),
(3, 'phone', '+919123456780', 'frequently_reported', 18),
(4, 'bank_account', '50100234981245', 'suspicious', 5),
(5, 'email', 'support@legitcompany.demo.example', 'no_reports', 0);

-- 8. USER NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, report_id, read_status, created_at) VALUES
(2, 'Report Status Updated', 'Your scam report SCAM-2026-000124 has been verified by the moderation team.', 'success', 'SCAM-2026-000124', FALSE, NOW() - INTERVAL '30 days'),
(2, 'High Risk Identifier Warning', 'A phone number you searched was recently flagged in 12 new community scam reports.', 'warning', NULL, FALSE, NOW() - INTERVAL '2 days'),
(8, 'Additional Info Needed', 'Please provide the registration invoice or email chain for report SCAM-2026-000130.', 'action_required', 'SCAM-2026-000130', FALSE, NOW() - INTERVAL '5 days'),
(3, 'Report Submitted', 'Your report SCAM-2026-000125 was received and queued for moderator review.', 'info', 'SCAM-2026-000125', TRUE, NOW() - INTERVAL '31 days');

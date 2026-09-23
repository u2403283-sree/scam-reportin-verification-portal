-- ==========================================================
-- SCAMSHIELD: PostgreSQL Database Schema
-- Production-ready relational schema with constraints, indexes, and FKs
-- ==========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    phone VARCHAR(50),
    avatar_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL,
    slug VARCHAR(80) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'ShieldAlert',
    severity_level VARCHAR(20) DEFAULT 'medium' CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    report_id VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'SCAM-2026-000124'
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reporter_name VARCHAR(120),
    reporter_email VARCHAR(255),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    amount_lost NUMERIC(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    state VARCHAR(100),
    city VARCHAR(100),
    platform VARCHAR(100), -- e.g. 'WhatsApp', 'Telegram', 'Instagram', 'SMS', 'Direct Call', 'Website'
    scam_method VARCHAR(255), -- e.g. 'Fake customer care number found on Google'
    risk_level VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Additional Information Required', 'Verified', 'Rejected', 'Duplicate')),
    community_upvotes INTEGER NOT NULL DEFAULT 1,
    views_count INTEGER NOT NULL DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_report_id ON reports(report_id);
CREATE INDEX IF NOT EXISTS idx_reports_category_id ON reports(category_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_risk_level ON reports(risk_level);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- 4. REPORT IDENTIFIERS TABLE (Normalized lookup table)
CREATE TABLE IF NOT EXISTS report_identifiers (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('phone', 'email', 'url', 'bank_account', 'social', 'crypto_wallet', 'other')),
    value VARCHAR(255) NOT NULL, -- Normalized raw value
    masked_value VARCHAR(255) NOT NULL, -- Masked for public presentation e.g. '+91 XXXXX 4582'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_report_identifiers_lookup ON report_identifiers(type, value);
CREATE INDEX IF NOT EXISTS idx_report_identifiers_report_id ON report_identifiers(report_id);

-- 5. REPORT EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS report_evidence (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'image/png', 'application/pdf', etc.
    file_size_bytes INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_report_id ON report_evidence(report_id);

-- 6. MODERATION ACTIONS TABLE
CREATE TABLE IF NOT EXISTS moderation_actions (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('approve', 'reject', 'request_info', 'change_risk', 'mark_duplicate', 'hide')),
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_moderation_report_id ON moderation_actions(report_id);

-- 7. VERIFICATION SEARCHES LOG
CREATE TABLE IF NOT EXISTS verification_searches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    identifier_type VARCHAR(30) NOT NULL,
    identifier_value VARCHAR(255) NOT NULL,
    result_status VARCHAR(30) NOT NULL CHECK (result_status IN ('no_reports', 'limited', 'suspicious', 'frequently_reported')),
    reports_matched INTEGER DEFAULT 0,
    ip_hash VARCHAR(64),
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verification_searches_user_id ON verification_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_searches_searched_at ON verification_searches(searched_at DESC);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'action_required')),
    report_id VARCHAR(30),
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, read_status);

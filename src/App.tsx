import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ReportScamPage } from './pages/ReportScamPage.tsx';
import { CheckReportPage } from './pages/CheckReportPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { AwarenessPage } from './pages/AwarenessPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { UserDashboardPage } from './pages/UserDashboardPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';

/**
 * App.tsx
 * -------------------------------------------------------------
 * Main Application Router with AuthProvider and dedicated Login Page.
 */
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Outer Layout: Light theme, clean spacing, no flashy animations */}
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportScamPage />} />
              <Route path="/check" element={<CheckReportPage />} />
              <Route path="/verify" element={<Navigate to="/check" replace />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/awareness" element={<AwarenessPage />} />
              <Route path="/safety" element={<Navigate to="/awareness" replace />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Login Page with Admin & User Role Detection */}
              <Route path="/login" element={<LoginPage />} />

              {/* Citizen / User Side */}
              <Route path="/user-dashboard" element={<UserDashboardPage />} />
              <Route path="/my-reports" element={<Navigate to="/user-dashboard" replace />} />

              {/* Administrator Side */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer.tsx
 * Simple, clean footer for the academic project.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-300 mt-12 py-6 text-sm text-gray-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-800">
              Scam Reporting &amp; Verification Portal
            </p>
            <p className="text-xs text-gray-500">
              A simple platform to report suspected scams and check reported information.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <Link to="/" className="hover:text-blue-600 underline">
              Home
            </Link>
            <Link to="/report" className="hover:text-blue-600 underline">
              Report Scam
            </Link>
            <Link to="/check" className="hover:text-blue-600 underline">
              Check Report
            </Link>
            <Link to="/reports" className="hover:text-blue-600 underline">
              View Reports
            </Link>
            <Link to="/awareness" className="hover:text-blue-600 underline">
              Awareness
            </Link>
            <Link to="/about" className="hover:text-blue-600 underline">
              About Project
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 text-center text-xs text-gray-500">
          Scam Reporting &amp; Verification System &bull; Built with React &amp; TypeScript
        </div>
      </div>
    </footer>
  );
};

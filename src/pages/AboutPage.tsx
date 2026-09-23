import React from 'react';

/**
 * AboutPage.tsx
 * -------------------------------------------------------------
 * Explains project purpose and technical details for the college viva/evaluation.
 *
 * Requirements:
 * "This project is developed as a college project to demonstrate how
 * a basic scam reporting and verification system can be designed."
 */
export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">About This Project</h1>
        <p className="text-sm text-gray-600 mt-1">
          Project Overview &bull; Basic Scam Reporting and Verification System
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Project Statement */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Project Brief</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            This project is developed as a college project to demonstrate how a basic scam reporting and verification system can be designed.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            The platform provides a centralized, community-driven interface where citizens can report suspicious contacts (phone numbers, email addresses, websites) and check incoming communications before falling prey to fraudulent schemes.
          </p>
        </section>

        {/* Objectives */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Project Objectives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="font-semibold text-gray-900 block mb-1">1. User Incident Reporting</span>
              Provide a simple, non-intrusive form for users to lodge scam complaints without requiring sensitive financial credentials.
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="font-semibold text-gray-900 block mb-1">2. Fast Verification Lookup</span>
              Allow users to check whether an unknown caller, sender email, or domain has previously been flagged by other victims.
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="font-semibold text-gray-900 block mb-1">3. Public Transparency</span>
              Display submitted reports in a structured table format with review statuses for verification and auditing.
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="font-semibold text-gray-900 block mb-1">4. Community Cyber Awareness</span>
              Educate general users regarding common scam patterns such as job fraud, fake customer care, and phishing links.
            </div>
          </div>
        </section>

        {/* System Architecture & Tech Stack */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Technology Stack Used</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                  <th className="p-2.5 border border-gray-200">Layer</th>
                  <th className="p-2.5 border border-gray-200">Technology</th>
                  <th className="p-2.5 border border-gray-200">Purpose in Project</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="p-2.5 border border-gray-200 font-medium">Frontend Framework</td>
                  <td className="p-2.5 border border-gray-200">React (with TypeScript)</td>
                  <td className="p-2.5 border border-gray-200">Component-based UI, reactive state handling for forms and search.</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-gray-200 font-medium">Styling</td>
                  <td className="p-2.5 border border-gray-200">Tailwind CSS</td>
                  <td className="p-2.5 border border-gray-200">Clean, simple utility classes with responsive layout.</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-gray-200 font-medium">Routing</td>
                  <td className="p-2.5 border border-gray-200">React Router DOM</td>
                  <td className="p-2.5 border border-gray-200">Seamless navigation between Home, Report, Check, Reports, and Awareness.</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-gray-200 font-medium">Data Storage</td>
                  <td className="p-2.5 border border-gray-200">Browser LocalStorage &amp; Firestore</td>
                  <td className="p-2.5 border border-gray-200">Persistent storage of reports across browser reloads for easy demonstration.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Viva Q&A / Demonstration Notes */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Quick Viva Q&amp;A (For Examiner / Reviewer)
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="font-semibold text-gray-900">Q: How does the verification system work?</p>
              <p className="mt-1 text-xs sm:text-sm">
                A: When a user enters a phone number, email, or domain into the "Check a Report" search bar, the service performs substring and normalized digit matching against all reported identifiers in the database. If a match is found, it displays the "Reported" status, report count, and case description.
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="font-semibold text-gray-900">Q: How are new reports validated?</p>
              <p className="mt-1 text-xs sm:text-sm">
                A: Client-side validation ensures that the email address contains '@' and '.', phone numbers contain exactly 10 numeric digits, and required description fields are filled before saving.
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="font-semibold text-gray-900">Q: Why are bank details and Aadhaar numbers not collected?</p>
              <p className="mt-1 text-xs sm:text-sm">
                A: By design principle, collecting sensitive banking credentials or government IDs creates privacy and security hazards. A community scam reporting portal only requires the scammer's contact identifier and incident details.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

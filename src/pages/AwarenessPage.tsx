import React from 'react';

/**
 * AwarenessPage.tsx
 * -------------------------------------------------------------
 * Basic scam awareness educational guide for college project.
 * Covers:
 * 1. Fake Job Scams
 * 2. Online Shopping Scams
 * 3. Phishing Emails
 * 4. Fake Customer-Care Calls
 * 5. Social Media Scams
 *
 * Uses short explanations and clean bullet points.
 */
export const AwarenessPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scam Awareness Guide</h1>
        <p className="text-sm text-gray-600 mt-1">
          Learn about common online and telephone scams and simple preventive tips to stay protected.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Fake Job Scams */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            1. Fake Job Scams
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            Scammers offer high-paying work-from-home or part-time jobs on WhatsApp, Telegram, or email, then demand money upfront for "registration", "laptop deposit", or "interview clearance".
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Key Warning Signs &amp; Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>Legitimate companies never ask job seekers to pay application or training fees.</li>
              <li>Offers sent via WhatsApp or Telegram without a formal interview are almost always fraudulent.</li>
              <li>Always check job openings on the official corporate career page.</li>
            </ul>
          </div>
        </section>

        {/* 2. Online Shopping Scams */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            2. Online Shopping Scams
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            Fraudulent websites and social media ads offer expensive items (iphones, gaming consoles, branded clothes) at 80% to 90% discount. Once money is transferred via UPI or card, the items never arrive.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Key Warning Signs &amp; Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>Unrealistic discounts are the biggest red flag.</li>
              <li>Check the domain spelling carefully (e.g. `amazn-deals.top` instead of `amazon.in`).</li>
              <li>Avoid portals that strictly insist on direct UPI or QR code advance payments with no Cash on Delivery.</li>
            </ul>
          </div>
        </section>

        {/* 3. Phishing Emails */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            3. Phishing Emails
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            Emails that pretend to come from banks, government agencies (Income Tax, Electricity Board), or cloud services urging you to click a link to claim refunds or avoid penalty.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Key Warning Signs &amp; Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>Look at the sender's full email address, not just the display name.</li>
              <li>Never enter bank passwords or OTPs on pages opened from email links.</li>
              <li>Official government and banking notices do not threaten immediate account freezing within 1 hour.</li>
            </ul>
          </div>
        </section>

        {/* 4. Fake Customer-Care Calls */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            4. Fake Customer-Care Calls
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            Scammers post fake toll-free or mobile numbers on Google Maps or forums for courier delivery, banks, or airline tickets. When victims call, they ask to install screen-sharing apps (AnyDesk, TeamViewer) or send an OTP.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Key Warning Signs &amp; Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>Never install screen sharing applications on the request of an unknown caller.</li>
              <li>Bank customer care will never ask for your debit card PIN or NetBanking password.</li>
              <li>Only obtain support contact numbers from the official verified mobile app or website.</li>
            </ul>
          </div>
        </section>

        {/* 5. Social Media Scams */}
        <section className="bg-white border border-gray-300 rounded p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            5. Social Media Scams
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            Hacked accounts, fake celebrity profiles, or crypto investment groups promising doubled money in 24 hours, or fake requests from friends asking for immediate financial emergency help.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Key Warning Signs &amp; Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>If a friend asks for urgent money via Instagram or Facebook DM, call them directly first.</li>
              <li>Guaranteed high returns on investments are 100% scam schemes.</li>
              <li>Enable two-factor authentication (2FA) on all your social media accounts.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Golden Rule Summary */}
      <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mt-6 text-sm text-yellow-900">
        <p className="font-bold mb-1">Golden Safety Rule:</p>
        <p>
          Never share your OTP, UPI PIN, or bank passwords with anyone over the phone or internet. Legitimate organizations will NEVER ask for your OTP.
        </p>
      </div>
    </div>
  );
};

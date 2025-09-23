//cpmponents/TermsAndConditions.tsx

import React from "react";

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">
            Terms and Conditions
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 font-['Montserrat']">
          <div className="prose max-w-none">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Last Updated: 22-09-2025</strong>
            </p>

            <p className="mb-4">
              <strong>Registered Name:</strong> CELTM Global Pvt Ltd (thereafter referred to as "CELTM," "Company," "we," "our," or "us").
            </p>

            <p className="mb-6">
              By visiting{" "}
              <a href="https://www.celtm.com" className="text-blue-600 hover:underline">
                https://www.celtm.com
              </a>{" "}
              or by purchasing products or services from CELTM Global Pvt Ltd (or any of its subdomains), you consent to the following Terms and Conditions ("Terms").
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold mb-4">1. GENERAL</h3>
              <p className="mb-6">
                CELTM Global Pvt Ltd operates as a Talent Intelligence and Technology company providing AI-powered solutions, training, and skill assessments. By using our website and services, you agree to comply with these Terms, our <strong>Privacy Policy</strong>, <strong>Data Protection Policy</strong>, and any other applicable guidelines.
              </p>
              <p className="mb-6">
                Accessing the Site in any manner (automated or otherwise) constitutes acceptance of these Terms. Continued use of the Site following changes or updates signifies your acceptance of the revised Terms.
              </p>

              <h3 className="text-xl font-bold mb-4">2. MODIFICATION OF TERMS</h3>
              <p className="mb-6">
                We reserve the right, at our sole discretion, to modify, update, or replace any of these Terms at any time. Significant changes will be communicated via email or a prominent notice on our Site. Your continued use of the Site constitutes acceptance of such updates.
              </p>

              <h3 className="text-xl font-bold mb-4">3. INTELLECTUAL PROPERTY RIGHTS</h3>
              <p className="mb-4">
                All content, logos, trademarks, and materials published on this Site are the exclusive property of CELTM Global Pvt Ltd and are protected under applicable copyright and trademark laws.
              </p>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li>Copy, reproduce, or distribute any material without our prior written consent.</li>
                <li>Modify, create derivative works, or exploit Site content for commercial purposes without authorization.</li>
              </ul>

              <h3 className="text-xl font-bold mb-4">4. DISCLAIMER</h3>
              <p className="mb-4">
                The information, products, and services offered on or through the Site are provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis, without warranties of any kind, either express or implied.
              </p>
              <p className="mb-2">We do not guarantee that:</p>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li>The Site will be uninterrupted or error-free.</li>
                <li>Any defects will be corrected.</li>
                <li>The Site or servers are free of viruses or harmful components.</li>
              </ul>
              <p className="mb-6">
                We also do not guarantee the accuracy, reliability, or usefulness of any third-party information provided on the Site.
              </p>

              <h3 className="text-xl font-bold mb-4">5. PURCHASES & TRANSACTIONS</h3>
              <p className="mb-2">By purchasing our products or services, you agree to:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Pay all applicable fees and charges in full and in advance.</li>
                <li>Use valid payment methods only.</li>
              </ul>
              <p className="mb-6">
                We rely on <strong>Third-Party Payment Service Providers</strong> for payment processing. CELTM is not responsible for the security, privacy, or functioning of such external platforms. Users are advised to review the third-party provider's terms and policies before transacting.
              </p>

              <h3 className="text-xl font-bold mb-4">6. DATA PROTECTION & PRIVACY</h3>
              <p className="mb-4">
                We adhere to India's <strong>Digital Personal Data Protection Act (DPDPA), 2023</strong>.
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Data is collected only with informed consent.</li>
                <li>Users have the right to withdraw consent, request correction, and demand deletion.</li>
                <li>We apply strict technical and organizational safeguards to protect data.</li>
              </ul>
              <p className="mb-6">
                For details, please see our <strong>Privacy Policy</strong> and <strong>Data Protection Policy</strong>.
              </p>

              <h3 className="text-xl font-bold mb-4">7. REFUND & CANCELLATION POLICY</h3>
              <p className="mb-6">
                Refunds and cancellations are governed by our <strong>Refund & Cancellation Policy</strong>, available on the Site. Unless explicitly mentioned, services once delivered are non-refundable.
              </p>

              <h3 className="text-xl font-bold mb-4">8. CODE OF CONDUCT</h3>
              <p className="mb-2">Users agree to:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Treat our team, partners, and community respectfully.</li>
                <li>Use our services only for lawful purposes.</li>
                <li>Avoid harassment, discrimination, or misuse of information.</li>
              </ul>
              <p className="mb-6">
                Violation may result in suspension or termination of services.
              </p>

              <h3 className="text-xl font-bold mb-4">9. INDEMNITY</h3>
              <p className="mb-2">
                You agree to indemnify and hold harmless CELTM, its directors, employees, and affiliates from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li>Violation of these Terms.</li>
                <li>Unauthorized use of Site content.</li>
                <li>Engagement with third-party payment or service providers.</li>
              </ul>

              <h3 className="text-xl font-bold mb-4">10. LIMITATION OF LIABILITY</h3>
              <p className="mb-6">
                To the maximum extent permitted by law, CELTM shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Site, services, or third-party tools.
              </p>

              <h3 className="text-xl font-bold mb-4">11. TERMINATION OF SERVICES</h3>
              <p className="mb-6">
                We reserve the right to terminate or suspend your access to the Site or Services at any time, with immediate effect, if you breach these Terms. All obligations regarding intellectual property, indemnity, and limitation of liability shall survive termination.
              </p>

              <h3 className="text-xl font-bold mb-4">12. GOVERNING LAW & JURISDICTION</h3>
              <p className="mb-6">
                These Terms shall be governed by and construed under the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in <strong>Ahmedabad, Gujarat, India</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-['Montserrat']"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
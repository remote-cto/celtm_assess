import React from "react";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">
            Privacy Policy
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
              <strong>Effective Date: 22-09-2025</strong>
            </p>

            <p className="mb-6">
              CELTM Global Pvt Ltd ("CELTM," "we," "our," or "us") owns and operates the website{" "}
              <a href="http://www.celtm.com" className="text-blue-600 hover:underline">
                www.celtm.com
              </a>{" "}
              (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our Service. It also outlines your rights under the{" "}
              <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and other applicable data protection laws.
            </p>

            <p className="mb-6">
              By using our Services, you agree to the terms of this Privacy Policy and expressly consent to our collection and processing of your personal information in the manner described herein. If you do not agree, please discontinue use of our Services.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold mb-4">1. INFORMATION WE COLLECT</h3>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Personal Data</h4>
              <p className="mb-4">
                We may collect personally identifiable information ("Personal Data") you provide directly, including but not limited to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Postal address (including city, state, province, ZIP/Pin code)</li>
                <li>Company or institutional details</li>
                <li>Transaction history related to your use of our Services</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">Cookies and Usage Data</h4>
              <p className="mb-4">We may also collect data automatically:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Log information (IP address, browser type, device ID, time of access, pages visited).</li>
                <li>Cookies and similar technologies to improve usability, analyze traffic, and personalize content.</li>
                <li>Tracking data from third-party services (e.g., Google Analytics) to understand user behavior.</li>
              </ul>
              <p className="mb-6">
                You can disable cookies through your browser settings, but some functionality may be impacted.
              </p>

              <h3 className="text-xl font-bold mb-4">2. HOW WE USE YOUR DATA</h3>
              <p className="mb-4">CELTM uses collected information for:</p>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li>Delivering and maintaining our Services.</li>
                <li>Providing customer support.</li>
                <li>Personalizing content and recommendations.</li>
                <li>Monitoring and analyzing usage to improve performance.</li>
                <li>Sending updates, alerts, or promotional messages (only with consent).</li>
                <li>Detecting, preventing, and addressing fraud, abuse, or technical issues.</li>
              </ul>

              <h3 className="text-xl font-bold mb-4">3. DATA RETENTION</h3>
              <p className="mb-6">
                We retain your Personal Data only as long as necessary for the purposes set out in this Privacy Policy. Retention may extend beyond service termination where required by law, to resolve disputes, or to enforce agreements.
              </p>

              <h3 className="text-xl font-bold mb-4">4. DATA TRANSFER & STORAGE</h3>
              <p className="mb-6">
                Your data may be processed on servers located outside your jurisdiction. By submitting your information, you consent to such transfers. CELTM will ensure adequate safeguards are in place to protect your Personal Data in compliance with DPDPA.
              </p>

              <h3 className="text-xl font-bold mb-4">5. DATA SHARING & DISCLOSURE</h3>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-2">With Third Parties</h4>
              <p className="mb-4">We may share your data only with:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Authorized service providers engaged in delivering our Services.</li>
                <li>Payment processors (e.g., Razorpay) for secure transaction handling.</li>
                <li>Analytics providers (e.g., Google Analytics) to track and improve Service performance.</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">For Legal Reasons</h4>
              <p className="mb-4">We may disclose your Personal Data:</p>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li>To comply with legal obligations.</li>
                <li>To protect CELTM's rights, property, or safety.</li>
                <li>To prevent or investigate unlawful activities.</li>
                <li>To comply with valid requests by law enforcement or regulatory authorities.</li>
              </ul>

              <h3 className="text-xl font-bold mb-4">6. YOUR RIGHTS UNDER DPDPA</h3>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li><strong>Access</strong>: Know what personal data we hold about you.</li>
                <li><strong>Correction</strong>: Request updates or corrections to your data.</li>
                <li><strong>Erasure</strong>: Request deletion of your data, subject to legal obligations.</li>
                <li><strong>Consent Management</strong>: Withdraw consent at any time by emailing{" "}
                  <a href="mailto:admin@celtm.com" className="text-blue-600 hover:underline">
                    admin@celtm.com
                  </a>.
                </li>
                <li><strong>Grievance Redressal</strong>: File complaints directly with CELTM's Grievance Officer.</li>
              </ul>

              <h3 className="text-xl font-bold mb-4">7. DATA SECURITY</h3>
              <p className="mb-4">We implement reasonable technical and organizational measures such as:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Encryption of sensitive data.</li>
                <li>Access controls with role-based permissions.</li>
                <li>Secure hosting with SSL.</li>
                <li>Regular audits and vulnerability testing.</li>
              </ul>
              <p className="mb-6">
                While we strive to protect your data, no method of transmission or storage is 100% secure. Use of our Services is at your own risk.
              </p>

              <h3 className="text-xl font-bold mb-4">8. PAYMENTS</h3>
              <p className="mb-6">
                We do not store your payment card details. Payments are processed directly by trusted third-party providers like{" "}
                <strong>Razorpay</strong>. Their privacy policies govern your payment information. See:{" "}
                <a href="https://razorpay.com/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Razorpay Privacy Policy
                </a>.
              </p>

              <h3 className="text-xl font-bold mb-4">9. LINKS TO THIRD-PARTY SITES</h3>
              <p className="mb-6">
                Our Services may contain links to third-party websites. We are not responsible for their practices, and we strongly advise reviewing the privacy policy of every external site you visit.
              </p>

              <h3 className="text-xl font-bold mb-4">10. ANALYTICS & ADVERTISING</h3>
              <p className="mb-4">
                We use Google Analytics to understand site usage and improve experience. You can opt out via the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Analytics Opt-Out Add-on
                </a>.
              </p>
              <p className="mb-6">Third parties may use cookies to display ads based on your browsing history.</p>

              <h3 className="text-xl font-bold mb-4">11. CHANGES TO THIS PRIVACY POLICY</h3>
              <p className="mb-6">
                We may update this Privacy Policy periodically. Updates will be posted on this page with a revised effective date. Continued use of our Services constitutes acceptance of the revised Privacy Policy.
              </p>

              <h3 className="text-xl font-bold mb-4">12. GRIEVANCE REDRESSAL & CONTACT INFORMATION</h3>
              <p className="mb-4">In compliance with the DPDPA, CELTM has appointed a Grievance Officer.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Grievance Officer</h4>
                <p><strong>Name:</strong> Harish K</p>
                <p><strong>Email:</strong>{" "}
                  <a href="mailto:office@celtm.com" className="text-blue-600 hover:underline">
                    office@celtm.com
                  </a>
                </p>
              </div>

              <p className="mb-4">
                We will acknowledge complaints within <strong>24 hours</strong> and aim to resolve them within{" "}
                <strong>10 business days</strong>.
              </p>

              <p className="mb-6">
                <strong>For general privacy concerns, contact us at:</strong>{" "}
                <a href="mailto:admin@celtm.com" className="text-blue-600 hover:underline">
                  admin@celtm.com
                </a>
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

export default PrivacyPolicy;
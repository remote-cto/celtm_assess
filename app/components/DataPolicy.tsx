// /components/DataPolicy.tsx
"use client";
import React from "react";

interface DataPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataPolicy: React.FC<DataPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">
            Data Protection & Management Policy
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
            <p className="text-sm text-gray-600 mb-2">
              <strong>Effective Date:</strong> 22-09-2025
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Issued By:</strong> CELTM Global Pvt Ltd
            </p>
            
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold mb-4">1. Purpose & Scope</h3>
                <p className="mb-4">This Data Protection & Management Policy (“Policy”) outlines how CELTM Global Pvt Ltd (“CELTM,” “we,” “our,” or “us”) collects, processes, stores, and protects personal data.</p>
                <p className="mb-4">Our primary compliance framework is the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> of India. In addition, CELTM adheres to internationally accepted principles of fairness, transparency, security, and accountability, ensuring alignment with global data protection standards.</p>
                <p className="mb-2">This Policy applies to:</p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>All personal data processed by CELTM, across our websites, products, services, and operations.</li>
                    <li>All employees, contractors, and third-party service providers acting on behalf of CELTM.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">2. Key Definitions</h3>
                 <ul className="list-disc list-inside mb-6 space-y-2">
                    <li><strong>Personal Data:</strong> Any information that can identify an individual directly or indirectly (e.g., name, email, phone, government ID).</li>
                    <li><strong>Sensitive Personal Data:</strong> Includes financial information, biometric identifiers, health data, etc.</li>
                    <li><strong>Data Fiduciary/Controller:</strong> CELTM, as the entity that determines how and why personal data is processed.</li>
                    <li><strong>Data Processor:</strong> Third parties that process personal data on behalf of CELTM (e.g., cloud providers).</li>
                    <li><strong>Consent:</strong> Freely given, informed, specific, and unambiguous indication of agreement by the Data Principal/Subject.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">3. Core Data Collection Principles</h3>
                <p className="mb-2">CELTM is committed to the following principles in handling personal data:</p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li><strong>Lawful & Fair Use:</strong> Data is collected and processed only for lawful and legitimate purposes.</li>
                    <li><strong>Consent Driven:</strong> Consent is explicit, informed, and revocable.</li>
                    <li><strong>Data Minimization:</strong> Only the minimum data necessary for the purpose is collected.</li>
                    <li><strong>Purpose Limitation:</strong> Data is used only for the purposes stated at the time of collection.</li>
                    <li><strong>Security:</strong> Strong safeguards protect data from misuse, unauthorized access, or loss.</li>
                    <li><strong>Transparency:</strong> Individuals are informed about how their data is used.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">4. Data Collection & Processing</h3>
                <p className="font-semibold mb-2">Categories of Data We Collect</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                    <li><strong>Personal Data:</strong> Name, email, phone number, postal address, institutional or employment details.</li>
                    <li><strong>Usage Data:</strong> IP address, browser type, device details, site interactions.</li>
                    <li><strong>Transaction Data:</strong> Records of payments and services availed.</li>
                </ul>
                <p className="font-semibold mb-2">Basis of Processing</p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li><strong>Explicit Consent</strong> (e.g., registrations, newsletters, workshop sign-ups).</li>
                    <li><strong>Legal Obligations</strong> (compliance with laws, audits, regulatory reporting).</li>
                    <li><strong>Legitimate Use</strong> (employment, contractual performance, IT security, business operations).</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">5. Consent Management</h3>
                <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>Consent is specific, informed, and freely given at the time of data collection.</li>
                    <li>Records of consent are securely maintained.</li>
                    <li>Consent may be withdrawn anytime by contacting <a href="mailto:privacy@celtm.com" className="text-blue-600 hover:underline">privacy@celtm.com</a>.</li>
                    <li>Services dependent on consent withdrawal may be limited, but withdrawal will not impact data lawfully processed before such withdrawal.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">6. Rights of Individuals</h3>
                 <p className="mb-2">CELTM ensures the following rights under DPDPA and globally recognized principles:</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                    <li><strong>Right to Access:</strong> Know what personal data is held and how it is processed.</li>
                    <li><strong>Right to Correction:</strong> Request updates or corrections to inaccurate data.</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of data, subject to legal or contractual obligations.</li>
                    <li><strong>Right to Restrict Processing:</strong> Limit how data is processed under certain conditions.</li>
                    <li><strong>Right to Consent Management:</strong> Review, modify, or withdraw consent at any time.</li>
                    <li><strong>Right to Data Portability:</strong> Receive data in a structured, commonly used format for transfer to another provider.</li>
                    <li><strong>Right to Grievance Redressal:</strong> Escalate concerns directly to CELTM’s Grievance Officer.</li>
                </ul>
                <p className="mb-6">Requests can be sent to <a href="mailto:admin@celtm.com" className="text-blue-600 hover:underline">admin@celtm.com</a> and will be addressed within statutory timelines.</p>

                <h3 className="text-xl font-bold mb-4">7. Data Storage & Retention</h3>
                <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>Data is stored in secure, access-controlled environments with encryption at rest and in transit.</li>
                    <li>Retention is limited to the period necessary for fulfilling the stated purpose or legal obligations.</li>
                    <li>Data no longer required is securely deleted or anonymized.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">8. Data Sharing & Transfers</h3>
                <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>Personal data is never sold.</li>
                    <li>Data may be shared with authorized service providers under strict confidentiality agreements.</li>
                    <li>Where data is transferred across borders, CELTM ensures equivalent protection measures are in place.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">9. Security & Breach Response</h3>
                <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>Multi-layered security including firewalls, encryption, access controls, and monitoring is implemented.</li>
                    <li>Employees undergo regular data protection training.</li>
                    <li>In case of a breach:
                        <ul className="list-disc list-inside ml-6 mt-2">
                            <li>CELTM will notify affected individuals and relevant authorities within required timelines.</li>
                            <li>Corrective actions will be taken immediately.</li>
                        </ul>
                    </li>
                </ul>

                <h3 className="text-xl font-bold mb-4">10. Grievance Redressal (DPDPA Requirement)</h3>
                <p className="mb-2">CELTM has appointed a Grievance Officer:</p>
                <div className="p-4 border rounded-lg bg-gray-50 mb-6">
                    <p><strong>Name:</strong> Harish K</p>
                    <p><strong>Email:</strong> <a href="mailto:office@celtm.com" className="text-blue-600 hover:underline">📧 office@celtm.com</a></p>
                </div>
                <p className="mb-6">Complaints will be acknowledged within 24 hours and resolved within 10 business days.</p>
                
                <h3 className="text-xl font-bold mb-4">11. Accountability & Review</h3>
                 <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>CELTM’s management and Data Protection Officer oversee compliance with this Policy.</li>
                    <li>This Policy will be reviewed annually or sooner if laws change.</li>
                    <li>Updates will be published on www.celtm.com.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">12. Contact</h3>
                <p>For questions, concerns, or rights requests: <a href="mailto:admin@celtm.com" className="text-blue-600 hover:underline">📧 admin@celtm.com</a></p>

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

export default DataPolicy;
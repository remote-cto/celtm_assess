// /components/RefundAndCancellationPolicy.tsx
"use client";
import React from "react";

interface RefundAndCancellationPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const RefundAndCancellationPolicy: React.FC<RefundAndCancellationPolicyProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">
            Refund and Cancellation Policy
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
              Thank you for choosing CELTM Global Pvt Ltd (“CELTM,” “we,” “our,” or “us”) for your courses,
              workshops (online/offline), and services. We value your trust and strive to deliver impactful
              learning and technology solutions. This Refund & Cancellation Policy outlines the conditions
              under which refunds or cancellations may apply.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold mb-4">1. General Policy</h3>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>
                  All purchases of courses, workshops, subscriptions, and services are non-cancellable and
                  non-refundable once payment is made.
                </li>
                <li>
                  Completion certificates will only be issued in the name of the candidate who attends and
                  successfully completes the course or workshop, including any required examinations or assignments.
                </li>
                <li>
                  If a candidate fails to attend, they will be marked absent and will not be eligible for
                  refunds, extensions, or additional access beyond the validity period.
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-4">2. Batch Transfers and Discretionary Refunds</h3>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>
                  Any request for batch transfers, rescheduling, or exceptions to the above policy will be at
                  the sole discretion of CELTM.
                </li>
                <li>
                  CELTM reserves the right to approve or decline such requests on a case-by-case basis.
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-4">3. Technical Issues</h3>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>
                  If you face technical issues while accessing our courses, workshops, or services, please
                  first contact our support team at{" "}
                  <a href="mailto:support@celtm.com" className="text-blue-600 hover:underline">
                    support@celtm.com
                  </a>.
                </li>
                <li>Response time will be within 3 working days.</li>
                <li>
                  If the issue is confirmed to be at our end and cannot be resolved, a full refund will be issued.
                </li>
                <li>
                  Refunds (where applicable) will be processed within 7–10 working days to the original payment
                  method.
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-4">4. No Liability for External Factors</h3>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>
                  CELTM shall not be responsible for issues caused by:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Poor internet connectivity or local device problems.</li>
                    <li>Delays or disruptions beyond our control (e.g., force majeure, third-party outages).</li>
                    <li>User error in accessing or using services.</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-4">5. Contact Information</h3>
              <p>
                For refund, cancellation, or support-related queries, please contact us at:{" "}
                <a href="mailto:admin@celtm.com" className="text-blue-600 hover:underline">
                📧 admin@celtm.com
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

export default RefundAndCancellationPolicy;
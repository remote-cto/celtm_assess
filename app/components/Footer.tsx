// /components/Footer.tsx
"use client";
import Image from "next/image";
import React, { useState } from "react";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import RefundAndCancellationPolicy from "./RefundAndCancellationPolicy";
import DataPolicy from "./DataPolicy";
import CodeOfConduct from "./CodeOfConduct";
import ScrollReveal from "./ScrollReveal";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDataPolicyModalOpen, setIsDataPolicyModalOpen] = useState(false);

  const [isConductModalOpen, setIsConductModalOpen] = useState(false);

  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);

  const openRefundModal = () => setIsRefundModalOpen(true);
  const closeRefundModal = () => setIsRefundModalOpen(false);

  const openDataPolicyModal = () => setIsDataPolicyModalOpen(true);
  const closeDataPolicyModal = () => setIsDataPolicyModalOpen(false);

  const openConductModal = () => setIsConductModalOpen(true);
  const closeConductModal = () => setIsConductModalOpen(false);

  return (
    <>
     <ScrollReveal direction="right">
      <footer className={`bg-white py-8 px-4 ${className}`}>
        <div className="max-w-7xl mx-auto font-['Montserrat']">
          

  
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
      {/* Logo */}
      <div className="flex items-center mb-6 lg:mb-0">
        <Image
          src="/images/CELTM.png"
          alt="CELTM Logo"
          width={168}
          height={168}
        />
      </div>

      {/* Social Icons */}
      <div className="flex gap-2">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/company/celtm"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-300 transition"
          aria-label="LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-700 hover:text-blue-600"
          >
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 24h5V7H0v17zm7.5-17h4.8v2.3h.1c.67-1.26 2.3-2.6 4.7-2.6 5 0 5.9 3.3 5.9 7.6V24h-5v-7.8c0-1.9 0-4.3-2.6-4.3s-3 2-3 4.1V24h-5V7z" />
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/@CELTM"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-300 transition"
          aria-label="YouTube"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-700 hover:text-red-600"
          >
            <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.9-.9-1.9-.9-2.3-1C16.9 2.5 12 2.5 12 2.5h-.1s-4.9 0-8.2.3c-.4.1-1.4.1-2.3 1C.7 4.5.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.7.9 2.4c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.9 0 8.2-.3c.4-.1 1.4-.1 2.3-1 .7-.7.9-2.4.9-2.4s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 14.5v-5l5.2 2.5-5.2 2.5z" />
          </svg>
        </a>

        {/* Email */}
        <a
          href="mailto:team@celtm.com"
         className="p-2 rounded-md bg-gray-100 hover:bg-gray-300 transition"
          aria-label="Email"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-700 hover:text-green-600"
          >
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </a>
      </div>
    </div>



          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-600 text-sm text-center md:text-left font-['Montserrat']">
                © 2026 CELTM, All Rights Reserved.
              </p>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm font-['Montserrat']">
                <button
                  onClick={openPrivacyModal}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={openTermsModal}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={openRefundModal}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Refund and Cancellation Policy
                </button>
                <button
                  onClick={openDataPolicyModal}
                  className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Data Policy
                </button>

                <button
                  onClick={openConductModal}
                  className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Code of Conduct
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </ScrollReveal>

      {/* Modals */}
      <TermsAndConditions isOpen={isTermsModalOpen} onClose={closeTermsModal} />
      <PrivacyPolicy isOpen={isPrivacyModalOpen} onClose={closePrivacyModal} />
      <RefundAndCancellationPolicy
        isOpen={isRefundModalOpen}
        onClose={closeRefundModal}
      />
      <DataPolicy
        isOpen={isDataPolicyModalOpen}
        onClose={closeDataPolicyModal}
      />

      <CodeOfConduct isOpen={isConductModalOpen} onClose={closeConductModal} />
    </>
  );
};

export default Footer;

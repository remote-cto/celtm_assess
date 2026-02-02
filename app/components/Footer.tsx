"use client";

import Image from "next/image";
import React, { useState } from "react";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import RefundAndCancellationPolicy from "./RefundAndCancellationPolicy";
import DataPolicy from "./DataPolicy";
import CodeOfConduct from "./CodeOfConduct";
import { Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDataPolicyModalOpen, setIsDataPolicyModalOpen] = useState(false);
  const [isConductModalOpen, setIsConductModalOpen] = useState(false);

  return (
    <>
      <footer className={`bg-white border-t border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* ================= MAIN GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* ---------- Brand Column ---------- */}
            <div className="space-y-4">
              <Image
                src="/images/CELTMLOGO.png"
                alt="CELTM Logo"
                width={170}
                height={60}
                priority
              />

              <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
                CELTM works at the intersection of capability, readiness, and
                opportunity — helping institutions, organizations, and
                individuals engage with clarity and purpose.
              </p>

              <div className="flex gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/company/celtm"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Linkedin className="w-5 h-5 text-gray-700 hover:text-blue-600" />
                </a>

                <a
                  href="https://www.youtube.com/@CELTM"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Youtube className="w-5 h-5 text-gray-700 hover:text-red-600" />
                </a>
              </div>
            </div>

            {/* ---------- Contact Column ---------- */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Contact Information
              </h4>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 079-45930555</span>
                </p>

                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a
                    href="mailto:team@celtm.com"
                    className="hover:text-gray-900 transition"
                  >
                    team@celtm.com
                  </a>
                </p>

                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>
                    E-704, Titanium City Center,
                    <br />
                    Nr Income Tax Office, Satellite,
                    <br />
                    Ahmedabad – 380015
                  </span>
                </p>
              </div>
            </div>

            {/* ---------- Policies Column ---------- */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Policies & Governance
              </h4>

              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-left hover:text-gray-900 transition cursor-pointer"
                >
                  Privacy Policy
                </button>

                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-left hover:text-gray-900 transition cursor-pointer"
                >
                  Terms & Conditions
                </button>

                <button
                  onClick={() => setIsRefundModalOpen(true)}
                  className="text-left hover:text-gray-900 transition cursor-pointer"
                >
                  Refund & Cancellation Policy
                </button>

                <button
                  onClick={() => setIsDataPolicyModalOpen(true)}
                  className="text-left hover:text-gray-900 transition cursor-pointer"
                >
                  Data Policy
                </button>

                <button
                  onClick={() => setIsConductModalOpen(true)}
                  className="text-left hover:text-gray-900 transition cursor-pointer"
                >
                  Code of Conduct
                </button>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="border-t border-gray-200 mt-10 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
              <p>© 2026 CELTM. All rights reserved.</p>
              <p>Designed for long-horizon capability systems.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}
      <TermsAndConditions
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <PrivacyPolicy
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <RefundAndCancellationPolicy
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
      />
      <DataPolicy
        isOpen={isDataPolicyModalOpen}
        onClose={() => setIsDataPolicyModalOpen(false)}
      />
      <CodeOfConduct
        isOpen={isConductModalOpen}
        onClose={() => setIsConductModalOpen(false)}
      />
    </>
  );
};

export default Footer;
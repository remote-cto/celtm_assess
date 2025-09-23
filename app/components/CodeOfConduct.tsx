// /components/CodeOfConduct.tsx
"use client";
import React from "react";

interface CodeOfConductProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeOfConduct: React.FC<CodeOfConductProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">
            Code of Conduct
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
                <h3 className="text-xl font-bold mb-4">1. Introduction</h3>
                <p className="mb-4">At CELTM Global Pvt Ltd (“CELTM”), we believe that ethics and integrity are the foundation of everything we do. Our mission to build India’s first Skill-Based LLM and empower talent with AI, data, cybersecurity, and emerging technologies comes with a responsibility: to act with fairness, accountability, and respect at all times.</p>
                <p className="mb-6">This Code of Conduct (“Code”) sets forth the standards of ethical and professional behavior expected of all employees, contractors, partners, and affiliates of CELTM. It is not just a set of rules—it is a reflection of our culture of trust, innovation, and responsibility.</p>
                
                <h3 className="text-xl font-bold mb-4">2. Scope</h3>
                <p className="mb-2">This Code applies to:</p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                    <li>All employees, directors, officers, interns, and advisors of CELTM.</li>
                    <li>All third parties, contractors, vendors, consultants, academic partners, and collaborators representing CELTM.</li>
                    <li>All activities, whether conducted onsite, online, or through client and partner engagements.</li>
                </ul>
                <p className="mb-6">Compliance with this Code is a condition of employment, partnership, or association with CELTM.</p>

                <h3 className="text-xl font-bold mb-4">3. Our Ethical Principles</h3>
                <div className="space-y-4 mb-6">
                    <div>
                        <h4 className="font-bold text-lg">3.1 Integrity & Transparency</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Always act with honesty, fairness, and openness.</li>
                            <li>Never engage in bribery, fraud, or corruption.</li>
                            <li>Disclose any potential conflicts of interest promptly.</li>
                            <li>Represent CELTM’s values truthfully in all interactions with clients, partners, and the public.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">3.2 Respect & Human Dignity</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Treat all colleagues, students, clients, and partners with dignity, empathy, and fairness.</li>
                            <li>CELTM enforces a zero-tolerance policy toward harassment, discrimination, bullying, or abusive behavior.</li>
                            <li>Encourage diversity, equity, and inclusion in all our activities.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">3.3 Data Ethics & Privacy</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Respect the privacy of individuals and institutions.</li>
                            <li>Handle personal data responsibly, in full compliance with the Digital Personal Data Protection Act, 2023 (DPDPA) and other applicable standards.</li>
                            <li>Use AI, data science, and digital tools only for ethical, lawful, and positive purposes.</li>
                            <li>Maintain confidentiality of proprietary and client information.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">3.4 Responsible Use of Technology</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Apply innovation responsibly, especially in AI and emerging technologies.</li>
                            <li>Avoid misuse of company resources, software, or intellectual property.</li>
                            <li>Ensure that all technology deployed is secure, transparent, and respectful of human rights.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">3.5 Compliance with Law</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Follow all applicable laws, regulations, and industry standards.</li>
                            <li>Cooperate with regulators, auditors, and oversight bodies when required.</li>
                            <li>Report any illegal, unethical, or suspicious activity immediately.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">3.6 Excellence & Accountability</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Strive for quality, innovation, and professionalism in every task.</li>
                            <li>Be accountable for your actions, decisions, and commitments.</li>
                            <li>Deliver promises to clients, students, and partners with reliability and consistency.</li>
                        </ul>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-4">4. Workplace Conduct</h3>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Maintain a professional, safe, and respectful work environment.</li>
                    <li>Avoid substance abuse, disruptive behavior, or misconduct during professional engagements.</li>
                    <li>Respect intellectual property rights, including open-source licenses, copyrights, and patents.</li>
                    <li>Use company resources (time, finances, tools) only for legitimate business purposes.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">5. Conflict of Interest</h3>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Avoid situations where personal interests interfere with CELTM’s interests.</li>
                    <li>Do not accept gifts, favors, or hospitality that could compromise judgment.</li>
                    <li>Any conflict—financial, relational, or professional—must be disclosed to management immediately.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">6. Data & Information Security</h3>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Protect sensitive company, client, and student data against unauthorized access or leaks.</li>
                    <li>Use secure practices (encryption, access control, reporting suspicious activity).</li>
                    <li>Never share credentials or misuse internal systems.</li>
                    <li>Immediately report data breaches or suspected incidents.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">7. Whistleblowing & Reporting</h3>
                <p className="mb-2">CELTM promotes a culture of speaking up without fear.</p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Employees and associates may confidentially report violations of this Code, unethical behavior, or concerns via <a href="mailto:compliance@celtm.com" className="text-blue-600 hover:underline">compliance@celtm.com</a> or directly to the Grievance Officer.</li>
                    <li>Retaliation against whistleblowers is strictly prohibited.</li>
                    <li>All reports will be investigated promptly, fairly, and discreetly.</li>
                </ul>
                
                <h3 className="text-xl font-bold mb-4">8. Disciplinary Action</h3>
                 <p className="mb-2">Violations of this Code will result in corrective or disciplinary actions, which may include:</p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Counseling or formal warnings.</li>
                    <li>Suspension of duties.</li>
                    <li>Termination of employment/contract.</li>
                    <li>Legal action or reporting to regulators, if necessary.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">9. Commitment to Ethical Leadership</h3>
                 <p className="mb-2">Leaders at CELTM are expected to set the tone for ethical behavior. They must:</p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Model integrity in decision-making.</li>
                    <li>Encourage open dialogue on ethical concerns.</li>
                    <li>Ensure teams understand and follow this Code.</li>
                    <li>Take swift action when standards are breached.</li>
                </ul>

                <h3 className="text-xl font-bold mb-4">10. A Living Document</h3>
                <p className="mb-6">This Code is not static—it evolves with our business, laws, and society. CELTM reviews this Code annually and makes updates as required. All employees and partners will be notified of changes.</p>

                <h3 className="text-xl font-bold mb-4">11. Acknowledgment</h3>
                <p className="mb-2">By being part of CELTM, you confirm that you have:</p>
                <ul className="list-disc list-inside mb-6 space-y-1">
                    <li>Read and understood this Code.</li>
                    <li>Agreed to uphold its principles.</li>
                    <li>Accepted that ethical behavior is a non-negotiable condition of your association with CELTM.</li>
                </ul>

                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-xl font-bold mb-4">Our Commitment</h3>
                    <p>At CELTM, ethics are not an afterthought—they are our foundation. We measure success not only by growth and innovation, but by the fairness, respect, and trust we build with every stakeholder.</p>
                </div>
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

export default CodeOfConduct;
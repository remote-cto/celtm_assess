// app/login/Page.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Hash,
  GraduationCap,
  LogIn,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  User,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../components/Footer";
import NewHeader from "../components/NewHeader";
import { getStudentData } from "@/utils/getStudentData";

// Helper function to get admin data from cookie
function getAdminData() {
  if (typeof window !== "undefined") {
    try {
      const cookieValue = getCookie("adminSession");
      if (cookieValue) {
        const cookieData = JSON.parse(cookieValue);
        return cookieData?.id ? cookieData : null;
      }
      // Fallback to sessionStorage for backward compatibility
      const sessionData = JSON.parse(
        sessionStorage.getItem("adminData") || "{}"
      );
      return sessionData?.id ? sessionData : null;
    } catch {
      return null;
    }
  }
  return null;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [loginType, setLoginType] = useState<"student" | "admin">("student");

  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const student = getStudentData(); 
    const admin = getAdminData(); 

    if (student) {
      router.push("/dashboard");
    } else if (admin) {
      router.push("/dean-dashboard");
    }
  }, []);

 
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/colleges");
        const data = await res.json();

        if (res.ok) {
          setColleges(
            data.colleges.map((college: any) => ({
              id: String(college.id),
              name: college.name,
            }))
          );
        } else {
          setError("Failed to load colleges");
        }
      } catch (err) {
        console.error("College fetch error:", err);
        setError("Something went wrong while loading colleges");
      } finally {
        setLoadingColleges(false);
      }
    };

    fetchColleges();
  }, []);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Conditions to proceed.");
      return;
    }

    setLoading(true);

    const selectedCollege = colleges.find((c) => c.id === collegeId);
    if (!selectedCollege) {
      setError("Please select a valid college");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          registration_number: registrationNumber,
          password,
          college_id: Number(collegeId),
          agreedToTerms,
        }),
      });

      const data = await response.json();

      if (response.ok) {

        sessionStorage.setItem(
          "studentData",
          JSON.stringify({
            id: data.student.id,
            name: data.student.name,
            email: data.student.email,
            registration_number: data.student.registration_number,
            college_name: data.student.college_name,
          })
        );
       
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Conditions to proceed.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/college-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: adminPassword, agreedToTerms }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("adminData", JSON.stringify(data.admin));
        
        router.push("/dean-dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-2 px-4 sm:px-6 lg:px-8 pt-4 relative overflow-hidden">
       
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-md mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8 transform transition-all duration-700 ease-out">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
              {loginType === "student" ? (
                <User className="h-8 w-8 text-white relative z-10" />
              ) : (
                <Shield className="h-8 w-8 text-white relative z-10" />
              )}
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 transition-all duration-300">
              {loginType === "student"
                ? "TIF Student Portal"
                : "Admin Dashboard"}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {loginType === "student"
                ? "Welcome back to your CELTM journey ✨"
                : "Manage your institution with ease 🎓"}
            </p>
          </div>

          {/* Toggle Login Type */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-white/20">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  loginType === "student"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setLoginType("student")}
              >
                <User className="inline w-4 h-4 mr-2" />
                Student
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  loginType === "admin"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setLoginType("admin")}
              >
                <Shield className="inline w-4 h-4 mr-2" />
                Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={
              loginType === "student" ? handleStudentLogin : handleAdminLogin
            }
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6 transform transition-all duration-500 hover:shadow-3xl"
          >
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300  ${
                    focusedField === "email" ? "text-blue-600" : "text-gray-400"
                  }`}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 border-gray-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email address"
                  required
                />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "email" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Registration Number (only for student) */}
            {loginType === "student" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registration Number
                </label>
                <div className="relative group">
                  <Hash
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      focusedField === "registration"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    onFocus={() => setFocusedField("registration")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 border-gray-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your registration number"
                    required
                  />
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                      focusedField === "registration"
                        ? "ring-2 ring-blue-500/20"
                        : ""
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                    focusedField === "password"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginType === "student" ? password : adminPassword}
                  onChange={(e) =>
                    loginType === "student"
                      ? setPassword(e.target.value)
                      : setAdminPassword(e.target.value)
                  }
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 border-gray-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-blue-600 focus:outline-none transition-all duration-300 transform hover:scale-110"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "password" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* College Dropdown (only for student) */}
            {loginType === "student" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  College
                </label>
                <div className="relative group">
                  <GraduationCap
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      focusedField === "college"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <select
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    onFocus={() => setFocusedField("college")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 border-gray-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 appearance-none cursor-pointer"
                    disabled={loadingColleges}
                    required
                  >
                    <option value="">
                      {loadingColleges
                        ? "Loading colleges..."
                        : "Select your college"}
                    </option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                      focusedField === "college"
                        ? "ring-2 ring-blue-500/20"
                        : ""
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all duration-300"
              />
              <label htmlFor="terms" className="text-sm font-medium text-gray-700 cursor-pointer">
                I agree to the <span className="text-blue-600 hover:text-blue-700 hover:underline" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms and Conditions</span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 relative overflow-hidden ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              )}
              <span className="relative z-10 flex items-center justify-center cursor-pointer">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    {loginType === "student"
                      ? "Login"
                      : "Access Admin Dashboard"}
                  </>
                )}
              </span>
            </button>

            {/* Registration link for students */}
            {loginType === "student" && (
              <div className="text-center mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-2">New to CELTM?</p>
                <Link
                  href="/Register"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Create your account
                </Link>
              </div>
            )}
          </form>
        </div>
       
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative shadow-2xl">
            <button 
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none bg-gray-100/50 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center z-10 transition-colors"
            >
              ✕
            </button>
            
            <div className="p-6 md:p-8 border-b shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="prose prose-sm md:prose-base text-gray-700 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">1. Purpose & Scope</h3>
                <p>This Data Protection & Management Policy (“Policy”) outlines how CELTM Global Pvt Ltd (“CELTM,” “we,” “our,” or “us”) collects, processes, stores, and protects personal data.</p>
                <p>Our primary compliance framework is the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> of India. In addition, CELTM adheres to internationally accepted principles of fairness, transparency, security, and accountability, ensuring alignment with global data protection standards.</p>
                <p>This Policy applies to:</p>
                <ul className="list-disc pl-5">
                  <li>All personal data processed by CELTM, across our websites, products, services, and operations.</li>
                  <li>All employees, contractors, and third-party service providers acting on behalf of CELTM.</li>
                </ul>
                
                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">2. Key Definitions</h3>
                <ul className="list-disc pl-5">
                  <li><strong>Personal Data:</strong> Any information that can identify an individual directly or indirectly (e.g., name, email, phone, government ID).</li>
                  <li><strong>Sensitive Personal Data:</strong> Includes financial information, biometric identifiers, health data, etc.</li>
                  <li><strong>Data Fiduciary/Controller:</strong> CELTM, as the entity that determines how and why personal data is processed.</li>
                  <li><strong>Data Processor:</strong> Third parties that process personal data on behalf of CELTM (e.g., cloud providers).</li>
                  <li><strong>Consent:</strong> Freely given, informed, specific, and unambiguous indication of agreement by the Data Principal/Subject.</li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">3. Core Data Collection Principles</h3>
                <p>CELTM is committed to the following principles in handling personal data:</p>
                <ul className="list-disc pl-5">
                  <li><strong>Lawful & Fair Use:</strong> Data is collected and processed only for lawful and legitimate purposes.</li>
                  <li><strong>Consent Driven:</strong> Consent is explicit, informed, and revocable.</li>
                  <li><strong>Data Minimization:</strong> Only the minimum data necessary for the purpose is collected.</li>
                  <li><strong>Purpose Limitation:</strong> Data is used only for the purposes stated at the time of collection.</li>
                  <li><strong>Security:</strong> Strong safeguards protect data from misuse, unauthorized access, or loss.</li>
                  <li><strong>Transparency:</strong> Individuals are informed about how their data is used.</li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">4. Data Collection & Processing</h3>
                <h4 className="font-medium text-gray-800 mt-2">Categories of Data We Collect</h4>
                <ul className="list-disc pl-5">
                  <li><strong>Personal Data:</strong> Name, email, phone number, postal address, institutional or employment details.</li>
                  <li><strong>Usage Data:</strong> IP address, browser type, device details, site interactions.</li>
                  <li><strong>Transaction Data:</strong> Records of payments and services availed.</li>
                </ul>
                <h4 className="font-medium text-gray-800 mt-2">Basis of Processing</h4>
                <p>Data is processed based on:</p>
                <ul className="list-disc pl-5">
                  <li><strong>Explicit Consent</strong> (e.g., registrations, newsletters, workshop sign-ups).</li>
                  <li><strong>Legal Obligations</strong> (compliance with laws, audits, regulatory reporting).</li>
                  <li><strong>Legitimate Use</strong> (employment, contractual performance, IT security, business operations).</li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">5. Consent Management</h3>
                <ul className="list-disc pl-5">
                  <li>Consent is <strong>specific, informed, and freely given</strong> at the time of data collection.</li>
                  <li>Records of consent are securely maintained.</li>
                  <li>Consent may be <strong>withdrawn anytime</strong> by contacting <a href="mailto:privacy@celtm.com" className="text-blue-600 hover:underline">privacy@celtm.com</a>.</li>
                  <li>Services dependent on consent withdrawal may be limited, but withdrawal will not impact data lawfully processed before such withdrawal.</li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">6. Rights of Individuals</h3>
                <p>CELTM ensures the following rights under DPDPA and globally recognized principles:</p>
                <ul className="list-disc pl-5">
                  <li><strong>Right to Access:</strong> Know what personal data is held and how it is processed.</li>
                  <li><strong>Right to Correction:</strong> Request updates or corrections to inaccurate data.</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of data, subject to legal or contractual obligations.</li>
                  <li><strong>Right to Restrict Processing:</strong> Limit how data is processed under certain conditions.</li>
                  <li><strong>Right to Consent Management:</strong> Review, modify, or withdraw consent at any time.</li>
                  <li><strong>Right to Data Portability:</strong> Receive data in a structured, commonly used format for transfer to another provider.</li>
                  <li><strong>Right to Grievance Redressal:</strong> Escalate concerns directly to CELTM’s Grievance Officer.</li>
                </ul>
                <p>Requests can be sent to <a href="mailto:admin@celtm.com" className="text-blue-600 hover:underline">admin@celtm.com</a> and will be addressed within statutory timelines.</p>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">7. Data Storage & Retention</h3>
                <ul className="list-disc pl-5">
                  <li>Data is stored in <strong>secure, access-controlled environments</strong> with encryption at rest and in transit.</li>
                  <li>Retention is limited to the period necessary for fulfilling the stated purpose or legal obligations.</li>
                  <li>Data no longer required is securely deleted or anonymized.</li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">8. Data Sharing & Transfers</h3>
                <ul className="list-disc pl-5">
                  <li>Personal data is <strong>never sold</strong>.</li>
                  <li>Data may be shared with authorized service providers under strict confidentiality agreements.</li>
                  <li>Where data is transferred across borders, CELTM ensures equivalent protection measures are in place.</li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">9. Security & Breach Response</h3>
                <ul className="list-disc pl-5">
                  <li>Multi-layered security including firewalls, encryption, access controls, and monitoring is implemented.</li>
                  <li>Employees undergo regular data protection training.</li>
                  <li>In case of a breach:
                    <ul className="list-disc pl-5 mt-1">
                      <li>CELTM will notify affected individuals and relevant authorities within required timelines.</li>
                      <li>Corrective actions will be taken immediately.</li>
                    </ul>
                  </li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">10. Grievance Redressal (DPDPA Requirement)</h3>
                <p>CELTM has appointed a Grievance Officer:</p>
                <p className="font-medium text-gray-800 mt-2">Grievance Officer</p>
                <p>Name: Harish K</p>
                <p>📧 Email: <a href="mailto:office@celtm.com" className="text-blue-600 hover:underline">office@celtm.com</a></p>
                <p className="mt-2">Complaints will be acknowledged within <strong>24 hours</strong> and resolved within <strong>10 business days</strong>.</p>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">11. Accountability & Review</h3>
                <ul className="list-disc pl-5">
                  <li>CELTM’s management and Data Protection Officer oversee compliance with this Policy.</li>
                  <li>This Policy will be reviewed annually or sooner if laws change.</li>
                  <li>Updates will be published on <a href="http://www.celtm.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.celtm.com</a>.</li>
                </ul>

                <hr className="my-4" />

                <h3 className="text-lg font-semibold text-gray-800">12. Contact</h3>
                <p>For questions, concerns, or rights requests:</p>
                <p>📧 <a href="mailto:admin@celtm.com" className="text-blue-600 hover:underline">admin@celtm.com</a></p>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end shrink-0">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors mr-3"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        /* Custom scrollbar for select dropdown */
        select::-webkit-scrollbar {
          width: 8px;
        }

        select::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        select::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        select::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
      `}</style>
    </>
  );
};

export default LoginPage;

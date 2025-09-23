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
      const sessionData = JSON.parse(sessionStorage.getItem("adminData") || "{}");
      return sessionData?.id ? sessionData : null;
    } catch {
      return null;
    }
  }
  return null;
}

// Helper function to get cookie by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Focus states for enhanced interactivity
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const student = getStudentData(); // now checks cookies first
    const admin = getAdminData(); // checks cookies first

    if (student) {
      router.push("/dashboard");
    } else if (admin) {
      router.push("/dean-dashboard");
    }
  }, []);

  // Fetch colleges on mount
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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Keep sessionStorage for backward compatibility
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
        // Cookie is automatically set by the API
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
    setLoading(true);

    try {
      const response = await fetch("/api/college-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: adminPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Keep sessionStorage for backward compatibility
        sessionStorage.setItem("adminData", JSON.stringify(data.admin));
        // Cookie is automatically set by the API
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
      <NewHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-2 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
        {/* Floating Elements for Visual Appeal */}
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
              {loginType === "student" ? "TIF Student Portal" : "Admin Dashboard"}
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
                      focusedField === "registration" ? "ring-2 ring-blue-500/20" : ""
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
              <span className="relative z-10 flex items-center justify-center">
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
        <div className="mt-5">
          <Footer />
        </div>
      </div>

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
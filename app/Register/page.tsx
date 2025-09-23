"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Hash,
  ChevronDown,
  Shield,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import NewHeader from "../components/NewHeader";

interface College {
  id: string;
  name: string;
}

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  registration_number: string;
  college_id: string;
  password: string;
}

type StudentFormErrors = Partial<Record<keyof StudentFormData, string>>;

const defaultFormState: StudentFormData = {
  name: "",
  email: "",
  phone: "",
  registration_number: "",
  college_id: "",
  password: "",
};

type FocusedField =
  | "name"
  | "email"
  | "phone"
  | "registration"
  | "college"
  | "password"
  | null;

const StudentRegistration: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    ...defaultFormState,
  });
  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendingCode, setResendingCode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 min
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState<boolean>(true);
  const [focusedField, setFocusedField] = useState<FocusedField>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("/api/colleges");
        const data = await response.json();
        if (response.ok) {
          setColleges(data.colleges as College[]);
        }
      } catch (error) {
      } finally {
        setCollegesLoading(false);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    if (showVerification && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showVerification, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: StudentFormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Please enter a valid 10-digit phone number";
    if (!formData.registration_number.trim())
      newErrors.registration_number = "Registration number is required";
    if (!formData.college_id) newErrors.college_id = "Please select a college";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setShowVerification(true);
        setTimeLeft(600);
        alert("Verification code sent to your email!");
      } else {
        alert(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (e: FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setVerificationError("Please enter the verification code");
      return;
    }
    setIsVerifying(true);
    setVerificationError("");
    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: verificationCode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsRegistered(true);
        alert("Registration successful! Welcome to CELTM.");
      } else {
        setVerificationError(
          data.error || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      setVerificationError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setResendingCode(true);
    try {
      const response = await fetch(
        `/api/register?email=${encodeURIComponent(formData.email)}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTimeLeft(600);
        setVerificationCode("");
        setVerificationError("");
        alert("New verification code sent to your email!");
      } else {
        alert(data.error || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      alert("Failed to resend code. Please try again.");
    } finally {
      setResendingCode(false);
    }
  };

  const handleStartOver = () => {
    setShowVerification(false);
    setVerificationCode("");
    setVerificationError("");
    setTimeLeft(600);
    setIsRegistered(false);
    setFormData({ ...defaultFormState });
  };

  // Success state...
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-2 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="max-w-md mx-auto relative z-10 pt-20">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full animate-ping opacity-20"></div>
              <CheckCircle className="h-8 w-8 text-white relative z-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Registration Successful!
            </h1>
            <p className="text-gray-600 text-lg">Welcome to CELTM ✨</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center transform transition-all duration-500 hover:shadow-3xl">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Your account has been created successfully. You can now start your
              journey with CELTM.
            </p>
            <div className="space-y-4">
              <Link
                href="/Login"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl inline-block"
              >
                Go to Login
              </Link>
              <button
                onClick={handleStartOver}
                className="w-full bg-gray-200/80 backdrop-blur-sm text-gray-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-300/80 transform hover:scale-105"
              >
                Register Another Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verification state...
  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-2 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <Image
          src="/images/CELTM.png"
          alt="CELTM Logo"
          width={148}
          height={148}
          className="text-white w-[70px] h-[48px] md:w-[150px] md:h-[100px] relative z-10"
        />
        <div className="max-w-md mx-auto relative z-10 pt-10">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
              <Shield className="h-8 w-8 text-white relative z-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We've sent a verification code to <br />
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formData.email}
              </span>
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setVerificationError("");
                  }}
                  className={`w-full px-4 py-4 text-center text-2xl font-mono border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 ${
                    verificationError
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="000000"
                  maxLength={6}
                />
                {verificationError && (
                  <p className="mt-2 text-sm text-red-600 font-medium animate-shake">
                    {verificationError}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50/50 rounded-lg p-3">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={handleVerification}
                disabled={isVerifying || timeLeft === 0}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 relative overflow-hidden ${
                  isVerifying || timeLeft === 0
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </span>
              </button>
              <div className="text-center space-y-3 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={resendingCode || timeLeft > 540}
                  className={`text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    resendingCode || timeLeft > 540
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {resendingCode ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                      Resending...
                    </span>
                  ) : (
                    "Resend Code"
                  )}
                </button>
              </div>
              <div className="text-center pt-2">
                <button
                  onClick={handleStartOver}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
                >
                  Change email address
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration UI...
  return (
    <>
      <NewHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-2 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="max-w-md mx-auto relative z-10">
          <div className="text-center mb-8 transform transition-all duration-700 ease-out">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
              <GraduationCap className="h-8 w-8 text-white relative z-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 transition-all duration-300">
              Student Registration
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Join CELTM and start your journey ✨
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6 transform transition-all duration-500 hover:shadow-3xl">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                    focusedField === "name" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  required
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "name" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 font-medium animate-shake">
                  {errors.name}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                    focusedField === "email" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email address"
                  required
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "email" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 font-medium animate-shake">
                  {errors.email}
                </p>
              )}
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative group">
                <Phone
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                    focusedField === "phone" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your phone number"
                  required
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500 ${
                    errors.phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "phone" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 font-medium animate-shake">
                  {errors.phone}
                </p>
              )}
            </div>
            {/* Registration Number */}
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
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("registration")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your registration number"
                  required
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500 ${
                    errors.registration_number
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "registration"
                      ? "ring-2 ring-blue-500/20"
                      : ""
                  }`}
                ></div>
              </div>
              {errors.registration_number && (
                <p className="mt-1 text-sm text-red-600 font-medium animate-shake">
                  {errors.registration_number}
                </p>
              )}
            </div>
            {/* College */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College
              </label>
              <div className="relative group">
                <GraduationCap
                  className={`absolute left-4 top-4 w-5 h-5 transition-all duration-300 ${
                    focusedField === "college"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <select
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("college")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-10 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300 appearance-none bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 cursor-pointer ${
                    errors.college_id
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  required
                  disabled={collegesLoading}
                >
                  <option value="">
                    {collegesLoading
                      ? "Loading colleges..."
                      : "Select your college"}
                  </option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "college" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
              {errors.college_id && (
                <p className="mt-1 text-sm text-red-600 font-medium animate-shake">
                  {errors.college_id}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a password"
                  required
                  className={`w-full pl-4 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-900 placeholder-gray-500 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  tabIndex={-1}
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                    focusedField === "password" ? "ring-2 ring-blue-500/20" : ""
                  }`}
                ></div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 font-medium animate-shake">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 relative overflow-hidden ${
                isSubmitting
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting
                ? "Sending Verification Code..."
                : "Send Verification Code"}
            </button>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/Login"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default StudentRegistration;

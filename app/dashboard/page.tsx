"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  GraduationCap,
  LogOut,
  SlidersHorizontal,
  List,
  BookUser,
  Play,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Bell,
} from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  college_name: string;
  org_id?: number; // Added org_id
}

interface AssessmentType {
  id: number;
  name: string;
  description: string;
}

// Helper function to get cookie by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

function getStudentData(): StudentData | null {
  if (typeof window !== "undefined") {
    try {
      const cookieValue = getCookie("studentSession");
      if (cookieValue) {
        const decodedValue = decodeURIComponent(cookieValue);
        const cookieData = JSON.parse(decodedValue);
        if (cookieData?.id) {
          return cookieData as StudentData;
        }
      }
    } catch (error) {
      console.error("Failed to parse student session cookie:", error);
      return null;
    }
  }
  return null;
}

const DashboardPage = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testType, setTestType] = useState("standard");
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<number | null>(null);

  useEffect(() => {
    const data = getStudentData();
    if (data) {
      setStudentData(data);
    } else {
      window.location.href = "/Login";
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (studentData) {
      const fetchAssessmentTypes = async () => {
        try {
          const org_id = studentData.org_id || 1; // Default to 1 if not present
          const response = await fetch(`/api/assessment-types?org_id=${org_id}`);
          const data = await response.json();
          if (data.success && data.assessment_types.length > 0) {
            setAssessmentTypes(data.assessment_types);
            setSelectedAssessmentType(data.assessment_types[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch assessment types:", error);
        }
      };
      fetchAssessmentTypes();
    }
  }, [studentData]);

  const handleStartAssessment = () => {
    if (selectedAssessmentType) {
      window.location.href = `/dashboard/assessment?type=${testType}&assessment_type_id=${selectedAssessmentType}`;
    } else {
      alert("Please select an assessment type.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: "student" }),
      });
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        window.location.href = "/Login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/Login";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">Student Portal</h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{studentData.name}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Section */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{studentData.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active Student
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm text-gray-900 truncate">{studentData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BookUser className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Registration</p>
                    <p className="text-sm text-gray-900">{studentData.registration_number}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">College</p>
                    <p className="text-sm text-gray-900">{studentData.college_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, {studentData.name.split(' ')[0]}!
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Ready to continue your learning journey? Let's get started with your assessment.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start New Assessment</h3>
                <p className="text-gray-600">Choose your preferred assessment and begin your test.</p>
              </div>

              {/* Assessment Type Selection Dropdown */}
              <div className="max-w-2xl mx-auto mb-8">
                <label htmlFor="assessment-type" className="block text-sm font-medium text-gray-700 mb-2">Select Assessment</label>
                <select
                  id="assessment-type"
                  name="assessment-type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedAssessmentType || ''}
                  onChange={(e) => setSelectedAssessmentType(Number(e.target.value))}
                  disabled={assessmentTypes.length === 0}
                >
                  {assessmentTypes.length > 0 ? (
                    assessmentTypes.map((assessment) => (
                      <option key={assessment.id} value={assessment.id}>{assessment.name}</option>
                    ))
                  ) : (
                    <option>Loading assessments...</option>
                  )}
                </select>
              </div>

              {/* Test Type Selection */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="testType"
                      value="adaptive"
                      checked={testType === "adaptive"}
                      onChange={(e) => setTestType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                      testType === "adaptive"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          testType === "adaptive" ? "bg-blue-500" : "bg-gray-400"
                        }`}>
                          <SlidersHorizontal className="h-5 w-5 text-white" />
                        </div>
                        {testType === "adaptive" && (
                          <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Test</h4>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="testType"
                      value="standard"
                      checked={testType === "standard"}
                      onChange={(e) => setTestType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                      testType === "standard"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          testType === "standard" ? "bg-blue-500" : "bg-gray-400"
                        }`}>
                          <List className="h-5 w-5 text-white" />
                        </div>
                        {testType === "standard" && (
                          <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Standard Test</h4>
                    </div>
                  </label>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <button
                  onClick={handleStartAssessment}
                  className="group inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Play className="h-5 w-5 mr-3" />
                  Start Assessment
                  <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Make sure you have a stable internet connection before starting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
"use client";
import React, { useState, useEffect } from "react";
import { Rocket, User, Mail, Hash, GraduationCap, LogOut, SlidersHorizontal, List } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  college_name: string;
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

// Main function to get and parse student data from cookie
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
  const [testType, setTestType] = useState("adaptive"); // 'adaptive' or 'standard'

  useEffect(() => {
    const data = getStudentData();
    if (data) {
      setStudentData(data);
    } else {
      window.location.href = "/Login";
    }
    setLoading(false);
  }, []);

  const handleStartAssessment = () => {
    // Navigate to the assessment page with the selected test type as a query parameter
    window.location.href = `/dashboard/assessment?type=${testType}`;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType: 'student' }),
      });
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        window.location.href = '/Login';
      }
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/Login";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome to Your Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <div className="text-center mb-6">
                <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {studentData.name}
                </h2>
                <p className="text-gray-600">Student Profile</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{studentData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Registration Number</p>
                    <p className="text-sm text-gray-900">{studentData.registration_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">College</p>
                    <p className="text-sm text-gray-900">{studentData.college_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Choose your assessment mode below to begin your journey.
                </p>

                {/* Test Type Selection */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-100 p-2">
                        <button onClick={() => setTestType('adaptive')} className={`flex flex-col items-center justify-center p-4 rounded-md transition-all duration-200 ${testType === 'adaptive' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}>
                            <SlidersHorizontal className="w-6 h-6 mb-2"/>
                            <span className="font-semibold">Adaptive Test</span>
                            <span className="text-xs mt-1 opacity-80">Difficulty adjusts</span>
                        </button>
                        <button onClick={() => setTestType('standard')} className={`flex flex-col items-center justify-center p-4 rounded-md transition-all duration-200 ${testType === 'standard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}>
                            <List className="w-6 h-6 mb-2"/>
                            <span className="font-semibold">Standard Test</span>
                             <span className="text-xs mt-1 opacity-80">Random questions</span>
                        </button>
                    </div>
                </div>
                
                <button
                  onClick={handleStartAssessment}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-xl shadow hover:bg-blue-700 transition duration-200"
                >
                  <Rocket className="w-5 h-5" />
                  Start Your Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


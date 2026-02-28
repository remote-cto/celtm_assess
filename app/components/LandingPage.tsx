"use client";
import React from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  FileText,
  BarChart3,
  Award,
  Brain,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

// Student data utility functions
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

function getStudentData(): {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  college_name: string;
  org_id?: number;
  tenant_id?: number;
  user_type_id?: number;
} | null {
  if (typeof window !== "undefined") {
    try {
      const cookieValue = getCookie("studentSession");
      if (cookieValue) {
        // Decode the URL-encoded cookie value before parsing
        const decodedValue = decodeURIComponent(cookieValue);
        const cookieData = JSON.parse(decodedValue);

        // Ensure the parsed data is valid and has an ID before returning
        if (cookieData?.id) {
          return cookieData;
        }
      }
    } catch (error) {
      console.error("Failed to parse student session cookie:", error);
      return null;
    }
  }
  return null;
}

const LandingPage = () => {
  const router = useRouter();
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced algorithms analyze your skills and provide detailed insights",
    },
    {
      icon: FileText,
      title: "Comprehensive Reports",
      description:
        "Get detailed reports highlighting your strengths and areas for improvement",
    },
    {
      icon: BarChart3,
      title: "Skill Mapping",
      description:
        "Visual representation of your skill levels across different domains",
    },
    {
      icon: Award,
      title: "Industry Validation",
      description:
        "Assessments recognized by leading companies and institutions",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your skill development journey over time",
    },
    {
      icon: CheckCircle,
      title: "Instant Results",
      description:
        "Get your assessment results and reports immediately upon completion",
    },
  ];

  const handleStartAssessment = () => {
    // Check if student is authenticated
    const studentData = getStudentData();

    if (!studentData) {
      // If not authenticated, redirect to login
      router.push("/Login");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="">
      <ScrollReveal direction="left">
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
          <div className="container mx-auto text-center relative z-10 max-w-6xl">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight mt-25">
                <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Discover Your True
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
                  Potential
                </span>
              </h1>

              <div className="mb-12 space-y-4">
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-semibold">
                  Take comprehensive skill assessments and get detailed reports
                </p>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform evaluates your skills across multiple domains and
                  provides actionable insights to boost your career
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
                <button
                  onClick={handleStartAssessment}
                  className="cursor-pointer group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full font-semibold text-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all transform hover:scale-105 flex items-center hover:from-blue-700 hover:to-purple-700 active:scale-95"
                >
                  Start Assessment
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal direction="right">
        <section className="py-5 px-4 sm:px-6 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the most comprehensive skill assessment platform
                designed for modern professionals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white border-blue-400 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border hover:border-blue-200 transform hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal direction="left">
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-2xl sm:text-5xl font-bold text-white mb-6">
              Ready to Unlock Your Potential?
            </h2>
            <p className="text-base md:text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of professionals who have discovered their
              strengths and transformed their careers through our comprehensive
              assessments.
            </p>
            <button
              onClick={handleStartAssessment}
              className="cursor-pointer group bg-white text-blue-600 px-6 py-4  md:px-8 md:py-4 rounded-full font-bold text-base md:text-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center mx-auto hover:bg-gray-50"
            >
              Get Started Today
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </ScrollReveal>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

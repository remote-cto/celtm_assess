"use client";
import React, { useState, useEffect } from "react";
import {
  Building,
  Network,
  Cpu,
  Link,
  Database,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const WeBuilding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    // Trigger animations on mount
    setTimeout(() => setIsVisible(true), 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildingItems = [
    {
      id: 1,
      title: "Regional Talent Anchors",
      description:
        "Select colleges and institutions across India will act as Emerging Tech Hubs — centers where raw talent is identified, validated, and prepped for real-world roles in new age driven by technology.",
      icon: Network,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      features: ["Tech Hub Networks", "Talent Validation"],
    },
    {
      id: 2,
      title: "Precision Validation Engine",
      description:
        "We're developing methods to measure readiness far beyond test scores — including micro-assessments, behavioral markers, and contextual fit, using both humans and AI.",
      icon: Cpu,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      features: ["Micro-assessments", "Behavioral Analysis"],
    },
    {
      id: 3,
      title: "Industry Access, Reimagined",
      description:
        "We don't believe in job boards. We build high-signal bridges — directly linking verified talent with emerging startups, global teams, and future-first employers.",
      icon: Link,
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-50 to-teal-50",
      features: ["Direct Connections", "Startup Partnerships"],
    },
    {
      id: 4,
      title: "The Talent Genome",
      description:
        "Imagine a living, growing database of skill pathways, career trajectories, and project-backed portfolios — all tied to talent that's validated, contextualized, and ready to deploy.",
      icon: Database,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      features: ["Skill Pathways", "Career Trajectories"],
    },
  ];

  return (
    <section className="relative  bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden font-['Inter']">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight font-['InterBold']">
            The Future of Talent Discovery
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-['Inter']">
            We're not just imagining the future of talent intelligence. We're
            building it.
          </p>
        </div>

        {/* Building Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16">
          {buildingItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`relative group cursor-pointer transition-all duration-700 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden group-hover:border-blue-300 hover:-translate-y-2">
                  {/* Animated Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-40 transition-all duration-500`}
                  ></div>

                  {/* Header with animated icon */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mr-4 shadow-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}
                      >
                        <Icon className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center opacity-20 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-45`}
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <h3
                      className={`text-2xl font-bold mb-4 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent group-hover:animate-pulse font-['InterRegular']`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Description with typing effect simulation */}
                  <p className="text-slate-600 leading-relaxed mb-6 relative z-10 group-hover:text-slate-700 transition-colors duration-300 font-['InterRegular']">
                    {item.description}
                  </p>

                  {/* Features with staggered animation */}
                  <div className="relative z-10 mb-2">
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${item.bgGradient} border border-slate-200`}
                        >
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-pulse"></div>

                  {/* Glowing border effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none blur-sm`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WeBuilding;

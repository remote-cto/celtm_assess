"use client";
import React, { useState, useEffect } from "react";
import {
  Brain,
  BookOpen,
  Shield,
  MapPin,
  Zap,
  Award,
  Building,
  FileText,
  Globe,
  User,
  Lightbulb,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Different = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const comparisonData = [
    {
      CELTM: {
        title: "Intelligence-led",
        description:
          "AI-powered insights drive talent decisions with precision and scale",
        icon: Brain,
        color: "from-blue-500 to-purple-500",
      },
      traditional: {
        title: "Instruction-led",
        description:
          "Generic training approaches without personalized intelligence",
        icon: BookOpen,
        color: "from-gray-400 to-gray-500",
      },
    },
    {
      CELTM: {
        title: "Talent Validation",
        description:
          "Comprehensive skill assessment and continuous performance tracking",
        icon: Shield,
        color: "from-purple-500 to-pink-500",
      },
      traditional: {
        title: "Just Certification",
        description:
          "Basic completion certificates without real skill validation",
        icon: Award,
        color: "from-gray-400 to-gray-500",
      },
    },
    {
      CELTM: {
        title: "Ecosystem Building",
        description:
          "Creating interconnected talent networks and collaborative environments",
        icon: Building,
        color: "from-blue-500 to-cyan-500",
      },
      traditional: {
        title: "Standalone Content",
        description: "Isolated learning modules without ecosystem integration",
        icon: FileText,
        color: "from-gray-400 to-gray-500",
      },
    },
    {
      CELTM: {
        title: "Regional Depth",
        description:
          "Localized expertise with deep understanding of regional markets",
        icon: MapPin,
        color: "from-green-500 to-blue-500",
      },
      traditional: {
        title: "Generic Scale",
        description:
          "One-size-fits-all approach without regional customization",
        icon: Globe,
        color: "from-gray-400 to-gray-500",
      },
    },
    {
      CELTM: {
        title: "Human + AI",
        description:
          "Perfect blend of human expertise enhanced by AI capabilities",
        icon: Zap,
        color: "from-orange-500 to-pink-500",
      },
      traditional: {
        title: "Manual Effort",
        description: "Time-consuming manual processes with limited scalability",
        icon: User,
        color: "from-gray-400 to-gray-500",
      },
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % comparisonData.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [comparisonData.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % comparisonData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + comparisonData.length) % comparisonData.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentComparison = comparisonData[currentIndex];

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden py-6">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Beyond Traditional Talent Solutions
          </h2>

          <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We don't just train people—we build intelligent talent ecosystems
            that adapt, evolve, and deliver measurable results.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-6xl mx-auto relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white bg-opacity-90 backdrop-blur-sm border border-slate-200 rounded-full p-3 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white bg-opacity-90 backdrop-blur-sm border border-slate-200 rounded-full p-3 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
          </button>

          {/* Comparison Card */}
          <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl transition-all duration-500 ease-in-out">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* CELTM Side */}
              <div className="relative">
                <div className="flex items-start space-x-4 mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${currentComparison.CELTM.color} rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all duration-300`}
                  >
                    <currentComparison.CELTM.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                        {currentComparison.CELTM.title}
                      </h3>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {currentComparison.CELTM.description}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    CELTM
                  </span>
                </div>
              </div>

              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs">VS</span>
                </div>
              </div>

              <div className="relative opacity-75">
                <div className="flex items-start space-x-4 mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${currentComparison.traditional.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <currentComparison.traditional.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-500">
                        {currentComparison.traditional.title}
                      </h3>
                      <X className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      {currentComparison.traditional.description}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0">
                  <span className="bg-slate-400 text-white px-3 py-1 rounded-full text-sm">
                    Traditional
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {comparisonData.map((_, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 w-8"
                    : "bg-slate-300 hover:bg-slate-400 w-3"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-slate-500">
              {currentIndex + 1} of {comparisonData.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Different;

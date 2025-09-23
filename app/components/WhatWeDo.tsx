//app/components/WhatWeDo.tsx

"use client";
import React, { useState } from "react";
import { Target, Lightbulb, Activity, MapPin } from "lucide-react";

const WhatWeDo = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [activeEquationPart, setActiveEquationPart] = useState(0);

  const equationParts = [
    {
      label: "Potential",
      icon: Lightbulb,
      color: "from-blue-500 to-cyan-500",
      description: "Innate capabilities and learning capacity",
    },
    {
      label: "Readiness",
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      description: "Current skill level and preparedness",
    },
    {
      label: "Context",
      icon: MapPin,
      color: "from-green-500 to-emerald-500",
      description: "Market demands and opportunities",
    },
    {
      label: "True Employability",
      icon: Target,
      color: "from-orange-500 to-red-500",
      description: "Measurable workforce readiness",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Cursor follower */}
      <div
        className="fixed w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none z-50 opacity-60 blur-sm transition-all duration-300"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />

      {/* Main Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Animated Background Elements */}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border-2 border-blue-200 shadow-2xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  The New Talent Equation
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-12">
                {equationParts.map((part, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`group relative transition-all duration-500 ${
                        activeEquationPart === index ? "scale-110" : "scale-100"
                      }`}
                    >
                      <div
                        className={`bg-gradient-to-r ${part.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[200px]`}
                      >
                        <div className="flex items-center justify-center mb-3">
                          <part.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">
                          {part.label}
                        </h3>
                        <p className="text-sm text-white/90 text-center">
                          {part.description}
                        </p>
                      </div>
                    </div>

                    {index < equationParts.length - 1 && (
                      <div className="text-4xl font-bold text-gray-400">
                        {index === equationParts.length - 2 ? "=" : "×"}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;

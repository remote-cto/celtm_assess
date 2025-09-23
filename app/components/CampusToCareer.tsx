"use client";
import Image from "next/image";
import React from "react";

interface FeatureCardProps {
  title: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 text-left shadow-md">
      <h3 className="text-slate-800 font-semibold text-lg mb-2">{title}</h3>
    </div>
  );
};

interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  const baseClasses =
    "px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105";
  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const CampusToCareer: React.FC = () => {
  const features = [
    {
      title: "Skill Intelligence Dashboard",
    },
    {
      title: "AI-Powered Upskilling",
    },
    {
      title: "Real-Time Progress Tracking",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight font-['InterBold']">
                From Potential to Performance – Made Measurable
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-['Inter']">
                We transform skill data into actionable insights and tailored
                upskilling—powered by AI, driven by outcomes.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 font-['Inter']">
              {features.map((feature, index) => (
                <FeatureCard key={index} title={feature.title} />
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/Industry.jpeg"
              alt="CELTM"
              width={600}
              height={600}
              className="w-full max-w-md h-auto object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusToCareer;

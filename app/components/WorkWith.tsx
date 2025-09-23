"use client";

import React from "react";
import { GraduationCap, Building2, Brain, Handshake } from "lucide-react";

const WorkWith: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight font-['InterBold']">
          Who We Work With
        </h1>

        {/* Two Cards per Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card
            icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
            title="Progressive Colleges"
            description="Redefining placement and skill-readiness with future-forward models."
          />
          <Card
            icon={<Building2 className="w-5 h-5 text-blue-600" />}
            title="Future-Ready Business"
            description="Who prioritize intelligent hiring over resume filters and test scores."
          />
          <Card
            icon={<Brain className="w-5 h-5 text-pink-600" />}
            title="Innovation-Driven Policymakers"
            description="Driving systemic change through scalable skill interventions."
          />
          <Card
            icon={<Handshake className="w-5 h-5 text-yellow-600" />}
            title="Strategic Partners"
            description="Helping us build regional talent ecosystems from the ground up."
          />
        </div>
    


        
        {/* Statistics Section */}
        {/*<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-12">
          //<StatBox number="100+" label="Colleges Empowered" />
          //<StatBox number="50+" label="Hiring Partners Aligned" />
          //<StatBox number="6" label="Countries Reached" />
          //<StatBox number="95%" label="Success Rate in Skilling Outcomes" />
        //</div> */}
        


        {/* Footer Quote */}
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-3xl mx-auto text-center">
          <h3 className="text-lg md:text-2xl  text-indigo-700 mb-4 font-['Inter']">
            A Vision Beyond Logos
          </h3>
          <p className="text-gray-700 text-base  mb-2 font-['Inter']">
            We don’t just work with clients — we collaborate with{" "}
            <strong>educators</strong>, <strong>business</strong>, and{" "}
            <strong>ecosystem leaders</strong> who believe in transforming
            talent from the inside out.
          </p>
          
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-white shadow-sm rounded-xl p-6 text-left">
    <div className="flex items-center gap-2 mb-2 font-semibold font-['Inter']">
      {icon}
      {title}
    </div>
    <p className="text-gray-600 text-sm font-['Inter']">{description}</p>
  </div>
);

const StatBox: React.FC<{ number: string; label: string }> = ({
  number,
  label,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm text-center">
    <div className="text-2xl font-bold text-indigo-700 font-['Inter']">
      {number}
    </div>
    <div className="text-gray-600 text-sm mt-1 font-['Inter']">{label}</div>
  </div>
);

export default WorkWith;

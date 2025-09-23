import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Page = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden font-['Inter']">
      <Navbar />
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-cyan-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.4) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative z-10 py-10 px-6 md:px-16 lg:px-24 mt-15">
        <div className="max-w-5xl mx-auto ">
          {/* Heading with modern styling */}
          <div className="text-center mb-3">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight font-['InterBold']">
              Mapping Talent
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full shadow-lg"></div>

            {/* Subheading */}
            <h3 className="text-2xl md:text-3xl font-bold text-slate-700 mb-12 font-['Inter']">
              Visibility for Talent That Was Never Seen
            </h3>
          </div>

          {/* Main content in elevated card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 md:p-12 shadow-2xl shadow-blue-100/50">
            {/* Opening paragraphs */}
            <div className="space-y-6 mb-10">
              <p className="text-xl text-slate-700 leading-relaxed font-['Inter']">
                In every classroom, cohort, or community — there are hidden
                gems.
              </p>

              <p className="text-xl text-slate-700 leading-relaxed font-['Inter']">
                The problem?{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-['Inter']">
                  No one's looking at the right signals.
                </span>
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Talent mapping engine card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-100/50">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                  <p className="text-lg font-bold text-blue-700 font-['Inter']">
                    Our talent mapping engine uses:
                  </p>
                </div>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                    <span>
                      <strong className="text-blue-700 font-['Inter']">Skill profiling</strong>{" "}
                      (measured & inferred)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                    <span>
                      <strong className="text-blue-700 font-['Inter']">
                        Domain preference mapping
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                    <span>
                      <strong className="text-blue-700 font-['Inter']">
                        Adaptability scores
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                    <span>
                      <strong className="text-blue-700 font-['Inter']">
                        Behavioral traits
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                    <span>
                      <strong className="text-blue-700 font-['Inter']">
                        Mentor and AI-led observation inputs
                      </strong>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Identification card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-100/50">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                  <p className="text-lg font-bold text-purple-700 font-['Inter']">
                    We identify:
                  </p>
                </div>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1 font-bold font-['Inter']">
                      •
                    </span>
                    <span>Who's coachable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1 font-bold">
                      •
                    </span>
                    <span className="font-['Inter']">Who's naturally aligned with emerging tech</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1 font-bold">
                      •
                    </span>
                    <span className="font-['Inter']">
                      Who may not be job-ready today — but is high-potential
                      tomorrow
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enhanced blockquote */}
            <div className="relative mb-10">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full shadow-sm"></div>
              <blockquote className="pl-8 py-6 bg-gradient-to-r from-cyan-50/70 to-blue-50/70 rounded-2xl border-l-4 border-cyan-400 shadow-sm">
                <p className="text-2xl text-slate-700 italic leading-relaxed mb-4 font-medium font-['Inter']">
                  We don't sort by grades.
                </p>
                <p className="text-2xl text-slate-700 italic leading-relaxed font- font-['Inter']">
                  We look deeper — and unlock what's often overlooked.
                </p>
              </blockquote>
            </div>

            {/* Closing line with emphasis */}
            <div className="text-center pt-8 border-t border-slate-200/50">
              <p className="text-xl text-slate-600 font-semibold font-['Inter']">
                This map is the foundation of every activation we run.
              </p>
            </div>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute top-32 right-10 w-6 h-6 bg-blue-400 rounded-full opacity-20 animate-bounce delay-300"></div>
          <div className="absolute bottom-40 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-20 animate-bounce delay-700"></div>
          <div className="absolute top-1/2 right-20 w-8 h-8 bg-cyan-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default Page;

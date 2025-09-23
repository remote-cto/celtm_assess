import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Page = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden font-['Inter']">
        <Navbar/>
      {/* Animated background elements - matching mapping talent page */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-cyan-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Subtle pattern overlay - matching mapping talent page */}
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
        <div className="max-w-5xl mx-auto">
          {/* Heading with modern styling */}
          <div className="text-center mb-3">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight font-['InterBold']">
              Building What Employers Actually Need
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full shadow-lg"></div>
          </div>

          {/* Main content in elevated card - matching mapping talent page shadow */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 md:p-12 shadow-2xl shadow-blue-100/50">
            {/* Opening paragraphs */}
            <div className="space-y-6 mb-10">
              <p className="text-xl text-slate-700 leading-relaxed font-['Inter']">
                We don't do long lectures or certification mills.
              </p>

              <p className="text-xl text-slate-700 leading-relaxed font-['Inter']">
                We build{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-['Inter']">
                  capability through short sprints, simulations, and feedback loops
                </span>
                .
              </p>
            </div>

            {/* Learning experience features */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 font-['Inter']">
                Each learning experience is:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-100/50">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <span className="text-lg font-semibold text-blue-700 font-['Inter']">
                      Built with <strong>real-world tools</strong>
                    </span>
                  </div>
                  <p className="text-slate-600 font-['Inter']">(ChatGPT, n8n, LangChain, etc.)</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-100/50">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <span className="text-lg font-semibold text-purple-700 font-['Inter']">
                      Embedded in <strong>problem-based scenarios</strong>
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50 hover:border-cyan-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-100/50">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <span className="text-lg font-semibold text-cyan-700 font-['Inter']">
                      Aligned to <strong>job roles</strong>, not just topics
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200/50 hover:border-indigo-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-100/50">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3 group-hover:animate-pulse shadow-sm"></div>
                    <span className="text-lg font-semibold text-indigo-700 font-['Inter']">
                      Personalized based on readiness mapping
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracks section */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 font-['Inter']">
                Tracks include:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tech track */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-100/50">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🧠</span>
                    <h4 className="text-lg font-bold text-blue-700 font-['Inter']">Tech</h4>
                  </div>
                  <div className="space-y-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">AI/ML</span>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Cybersecurity</span>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Data Science</span>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Cloud</span>
                  </div>
                </div>

                {/* Non-Tech track */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-100/50">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">📊</span>
                    <h4 className="text-lg font-bold text-purple-700 font-['Inter']">Non-Tech</h4>
                  </div>
                  <div className="space-y-2">
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">AI for Biz</span>
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Prompting</span>
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">No-Code Automation</span>
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">AI for Creatives</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student outcomes */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 font-['Inter']">
                Every student exits with:
              </h3>
              
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50 hover:border-cyan-300/70 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-100/50">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-3 mt-1 font-bold">•</span>
                    <span className="text-lg text-slate-700 font-['Inter']">
                      A <strong className="text-cyan-700">project portfolio</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-3 mt-1 font-bold">•</span>
                    <span className="text-lg text-slate-700 font-['Inter']">
                      A <strong className="text-cyan-700">verified readiness score</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-3 mt-1 font-bold">•</span>
                    <span className="text-lg text-slate-700 font-['Inter']">
                      <strong className="text-cyan-700">Confidence</strong> to step into internships, startups, or solo ventures
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enhanced blockquote - matching mapping talent page */}
            <div className="relative mb-10">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full shadow-sm"></div>
              <blockquote className="pl-8 py-6 bg-gradient-to-r from-cyan-50/70 to-blue-50/70 rounded-2xl border-l-4 border-cyan-400 shadow-sm">
                <p className="text-2xl text-slate-700 italic leading-relaxed mb-4 font-medium font-['Inter']">
                  It's not about finishing a course.
                </p>
                <p className="text-2xl text-slate-700 italic leading-relaxed font-medium font-['Inter']">
                  It's about being ready to build, do, and grow.
                </p>
              </blockquote>
            </div>
          </div>

          {/* Floating elements for visual interest - matching mapping talent page */}
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
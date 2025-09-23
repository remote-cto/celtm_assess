"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NewNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav
        className={`fixed w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50"
            : "text-black"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <Image
                src="/images/CELTM.png"
                alt="CELTM Logo"
                width={148}
                height={148}
                className="text-white w-[120px] h-[75px] md:w-[220px] md:h-[150px]"
              />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`relative transition-colors duration-300 group font-semibold text-base ${
                  isScrolled ? "text-black" : "text-black"
                }`}
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/model"
                className={`relative transition-colors duration-300 group font-semibold text-base ${
                  isScrolled ? "text-black" : "text-black"
                }`}
              >
                The Model
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/readiness"
                className={`relative transition-colors duration-300 group font-semibold text-base ${
                  isScrolled ? "text-black" : "text-black"
                }`}
              >
                Readiness
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/access"
                className={`relative transition-colors duration-300 group font-semibold text-base ${
                  isScrolled ? "text-black" : "text-black"
                }`}
              >
                Access
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              <Link
                href="/contact"
                className={`relative transition-colors duration-300 group font-semibold text-base ${
                  isScrolled ? "text-black" : "text-black"
                }`}
              >
                Let's Talk
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <div className="flex items-center space-x-3">
                <Link href="/Login">
                  <button
                    className={`flex items-center px-4 py-2 rounded-full font-semibold border-2 transition-all duration-300 ${
                      isScrolled 
                        ? "text-black border-2 border-black px-4 py-2 rounded-full  hover:bg-white/10 hover:border-white/50" 
                        : "text-black border-2 border-black px-4 py-2 rounded-full hover:bg-white/10 hover:border-white/50"
                    }`}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </button>
                </Link>
                <Link href="/Register">
                  <button className="flex items-center group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-base hover:shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:scale-105 hover:from-blue-700 hover:to-purple-700 active:scale-95 justify-center border-2 border-white/20 backdrop-blur-sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </button>
                </Link>
              </div>
            </div>

            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "hover:bg-slate-100" : "hover:bg-white/10"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X
                  className={`w-6 h-6 ${
                    isScrolled ? "text-slate-700" : "text-white"
                  }`}
                />
              ) : (
                <Menu
                  className={`w-6 h-6 ${
                    isScrolled ? "text-slate-700" : "text-white"
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-lg z-30 md:hidden">
          <div className="flex flex-col h-full pt-24 pb-8 px-6">
            {/* Navigation Links */}
            <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              <Link
                href="/"
                className="text-lg text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/model"
                className="text-lg text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                The Model
              </Link>
              <Link
                href="/readiness"
                className="text-lg text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Readiness
              </Link>
              <Link
                href="/access"
                className="text-lg text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Access
              </Link>
              <Link
                href="/contact"
                className="text-lg text-slate-800 hover:text-slate-900 transition-colors hover:scale-110 transform duration-300 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Let's Talk
              </Link>
            </div>

            {/* Login/Register Buttons */}
            <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto">
              <Link href="/Login" className="w-full">
                <button 
                  className="flex items-center justify-center border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-slate-50 hover:border-slate-400 transition-all w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </button>
              </Link>
              <Link href="/Register" className="w-full">
                <button 
                  className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all w-full transform hover:scale-105 active:scale-95"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewNavbar;
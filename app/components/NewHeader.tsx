"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NewHeader = () => {
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
            : "bg-transparent"
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

            {/* Desktop Navigation - Reduced spacing from space-x-8 to space-x-6 */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`relative transition-colors duration-300 group font-medium text-base px-3 py-2 rounded-lg hover:bg-slate-50/50 ${
                  isScrolled
                    ? "text-slate-800 hover:text-slate-900"
                    : "text-slate-800 hover:text-slate-900"
                }`}
              >
                Home
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-[calc(100%-24px)] transition-all duration-300"></span>
              </Link>

              <Link
                href="/model"
                className={`relative transition-colors duration-300 group font-medium text-base px-3 py-2 rounded-lg hover:bg-slate-50/50 ${
                  isScrolled
                    ? "text-slate-800 hover:text-slate-900"
                    : "text-slate-800 hover:text-slate-900"
                }`}
              >
                The Model
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-[calc(100%-24px)] transition-all duration-300"></span>
              </Link>

              <Link
                href="/readiness"
                className={`relative transition-colors duration-300 group font-medium text-base px-3 py-2 rounded-lg hover:bg-slate-50/50 ${
                  isScrolled
                    ? "text-slate-800 hover:text-slate-900"
                    : "text-slate-800 hover:text-slate-900"
                }`}
              >
                Readiness
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-[calc(100%-24px)] transition-all duration-300"></span>
              </Link>

              <Link
                href="/access"
                className={`relative transition-colors duration-300 group font-medium text-base px-3 py-2 rounded-lg hover:bg-slate-50/50 ${
                  isScrolled
                    ? "text-slate-800 hover:text-slate-900"
                    : "text-slate-800 hover:text-slate-900"
                }`}
              >
                Access
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-[calc(100%-24px)] transition-all duration-300"></span>
              </Link>

              {/* CTA Button for Let's Talk */}
              <Link
                href="/contact"
                className={`relative transition-colors duration-300 group font-medium text-base px-3 py-2 rounded-lg hover:bg-slate-50/50 ${
                  isScrolled
                    ? "text-slate-800 hover:text-slate-900"
                    : "text-slate-800 hover:text-slate-900"
                }`}
              >
                Let's Talk
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X
                  className={`w-6 h-6 ${
                    isScrolled ? "text-slate-700" : "text-slate-700"
                  }`}
                />
              ) : (
                <Menu
                  className={`w-6 h-6 ${
                    isScrolled ? "text-slate-700" : "text-slate-700"
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
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
              <Link
                href="/"
                className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-105 transform duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/model"
                className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-105 transform duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                The Model
              </Link>

              <Link
                href="/readiness"
                className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-105 transform duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Readiness
              </Link>

              <Link
                href="/access"
                className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-105 transform duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Access
              </Link>
              <Link
                href="/contact"
                className="text-2xl text-slate-800 hover:text-slate-900 transition-colors hover:scale-105 transform duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Let's Talk
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewHeader;

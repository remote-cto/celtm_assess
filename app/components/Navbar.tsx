"use client";

import React, { useState } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <>
      {/* Navigation */}
      <nav className="fixed w-full z-40 transition-all duration-500 bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50">
        <div className="container mx-auto px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <Link href="/">
                <Image
                  src="/images/CELTMLOGO.png"
                  alt="CELTM Logo"
                  width={145}
                  height={145}
                />
              </Link>
            </div>

            {isHomePage && (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/Login">
                  <button className="flex items-center border-2 border-slate-300 px-4 py-2 rounded-full font-semibold text-black hover:bg-slate-100 transition">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </button>
                </Link>

                <Link href="/Register">
                  <button className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </button>
                </Link>
              </div>
            )}

            {isHomePage && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && isHomePage && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-lg z-30 md:hidden">
          <div className="flex flex-col h-full pt-40 pb-8 px-6">
            <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto">
              <Link href="/Login" className="w-full">
                <button className="flex items-center justify-center border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 hover:border-blue-300 transition-all w-full">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </button>
              </Link>

              <Link href="/Register" className="w-full">
                <button className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:scale-105 transition w-full">
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

export default Navbar;

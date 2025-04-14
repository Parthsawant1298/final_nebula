"use client";
import React, { useState } from 'react';
import Link from "next/link";

const Button = ({ children, href }) => (
  <Link href={href}>
    <button className="px-4 py-2 text-base font-medium text-white bg-[#9340FF] rounded-md hover:bg-[#7d35d9] transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(147,64,255,0.5)]">
      {children}
    </button>
  </Link>
);

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#9340FF]/40 bg-[#0A0212] bg-opacity-95 backdrop-blur-md shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
        
          <img src="/images/brainwave.svg" alt="Nebula" className="w-24 h-8" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/">
              Home
          </Link>
          <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/about">
            About Us
          </Link>
          <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/faq">
            Faq
          </Link>
          <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/contact">
            Contact
          </Link>
        </nav>

        {/* Desktop Sign In Button */}
        <div className="hidden md:block">
          <Button href="/login">Sign in</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-[#9340FF] transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#9340FF]/30">
          <div className="flex flex-col space-y-4 px-4 py-6 bg-[#080110]/95 backdrop-blur-lg">
            <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/">
                Home
            </Link>
            <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/about">
              About Us
            </Link>
            <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/faq">
              Faq
            </Link>
            <Link className="text-base font-medium text-gray-400 hover:text-[#9340FF] transition-colors duration-200" href="/contact">
              Contact
            </Link>
            <div className="pt-4">
              <Button href="/login">Sign in</Button>
            </div>
          </div>
        </div>
      )}

      {/* Glowing border effect at bottom */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#9340FF]/70 to-transparent" 
           style={{ boxShadow: '0 0 10px rgba(147, 64, 255, 0.7)' }}></div>
    </header>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, PlusCircle, MapPin } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080C14]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
            : 'bg-[#080C14]/80 backdrop-blur-sm py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                H
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  HOMLIZ
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 inline" /> Gorakhpur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/residential"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Residential
              </Link>
              <Link
                href="/commercial"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Commercial
              </Link>
              <Link
                href="/#why-us"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/#footer"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right Action CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 text-sm">
                <PlusCircle className="w-4 h-4" />
                <span>List Property</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

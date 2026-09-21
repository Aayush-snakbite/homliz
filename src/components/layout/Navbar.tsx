'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, PlusCircle, MapPin, User, LogOut, LayoutDashboard, Building } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated, logout, isOwner } = useAuth();

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

            {/* Right Action CTA & Auth Status */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block max-w-[120px] truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">
                        {user.role}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#0F1626] border border-white/10 rounded-2xl shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
                      </div>

                      {user.role === 'property_owner' && (
                        <Link
                          href="/owner/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Owner Dashboard</span>
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <>
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>

                          <Link
                            href="/admin/properties/pending"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-500/10 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Pending Queue</span>
                          </Link>

                          <Link
                            href="/admin/properties"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors mb-1"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>All Properties</span>
                          </Link>
                        </>
                      )}

                      {user.role === 'tenant' && (
                        <>
                          <Link
                            href="/tenant/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Tenant Dashboard</span>
                          </Link>

                          <Link
                            href="/tenant/favorites"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors"
                          >
                            <User className="w-4 h-4 text-emerald-400" />
                            <span>Saved Properties</span>
                          </Link>

                          <Link
                            href="/tenant/enquiries"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors"
                          >
                            <User className="w-4 h-4 text-indigo-400" />
                            <span>My Enquiries</span>
                          </Link>

                          <Link
                            href="/tenant/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors mb-1"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>My Profile</span>
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/10 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <Link
                href={user?.role === 'property_owner' ? '/owner/properties/new' : '/login'}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Property</span>
              </Link>
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

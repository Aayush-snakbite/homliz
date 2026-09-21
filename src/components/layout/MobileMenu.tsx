'use client';

import React from 'react';
import Link from 'next/link';
import { X, MapPin, Building2, Home, Info, PhoneCall, PlusCircle, Search, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0B111E] border-l border-white/10 p-6 z-50 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold p-2 rounded-lg text-lg">
                    H
                  </div>
                  <div>
                    <span className="text-xl font-bold tracking-tight text-white">HOMLIZ</span>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 block font-semibold">Gorakhpur, UP</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close Mobile Menu"
                  className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Session Bar in Mobile Drawer */}
              <div className="my-6">
                {isAuthenticated && user ? (
                  <div className="bg-[#0F1626] border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block truncate max-w-[140px]">{user.name}</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">{user.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200 hover:text-white"
                    >
                      <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Log In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {isAuthenticated && user?.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#0F1626] border border-emerald-500/40 text-emerald-300 font-bold mb-2"
                  >
                    <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {isAuthenticated && user?.role === 'property_owner' && (
                  <Link
                    href="/owner/dashboard"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 mb-2"
                  >
                    <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                    <span>Owner Dashboard</span>
                  </Link>
                )}

                {isAuthenticated && user?.role === 'tenant' && (
                  <Link
                    href="/tenant/dashboard"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 mb-2"
                  >
                    <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                    <span>Tenant Dashboard</span>
                  </Link>
                )}

                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Home className="w-5 h-5 text-slate-400" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/properties"
                  onClick={onClose}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Search className="w-5 h-5 text-slate-400" />
                  <span>Search Properties</span>
                </Link>

                <Link
                  href="/residential"
                  onClick={onClose}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Home className="w-5 h-5 text-slate-400" />
                  <span>Residential Rentals</span>
                </Link>

                <Link
                  href="/commercial"
                  onClick={onClose}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <span>Commercial Spaces</span>
                </Link>
              </nav>
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-white/10 mt-8 space-y-4">
              <Link
                href={user?.role === 'property_owner' ? '/owner/properties/new' : '/login'}
                onClick={onClose}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3.5 px-5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-5 h-5" />
                <span>List Property</span>
              </Link>

              <div className="text-center text-xs text-slate-400 pt-2">
                Dedicated real-estate marketplace for Gorakhpur, UP
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

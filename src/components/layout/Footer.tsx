'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#05080E] border-t border-white/10 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-emerald-500/20">
                H
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">
                  HOMLIZ
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  Gorakhpur, Uttar Pradesh
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              HOMLIZ is a dedicated local real-estate and rental marketplace focused specifically on Gorakhpur, Uttar Pradesh. Discover verified residential flats, independent houses, and prime commercial spaces.
            </p>

            <div className="flex items-center space-x-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gorakhpur, UP, India</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>homliz.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Rentals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="#properties" className="hover:text-emerald-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="#residential" className="hover:text-emerald-400 transition-colors">
                  Residential Rentals
                </Link>
              </li>
              <li>
                <Link href="#commercial" className="hover:text-emerald-400 transition-colors">
                  Commercial Spaces
                </Link>
              </li>
              <li>
                <Link href="#why-us" className="hover:text-emerald-400 transition-colors">
                  Why HOMLIZ
                </Link>
              </li>
            </ul>
          </div>

          {/* Gorakhpur Localities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Top Localities
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="#areas" className="hover:text-emerald-400 transition-colors">
                  Civil Lines
                </Link>
              </li>
              <li>
                <Link href="#areas" className="hover:text-emerald-400 transition-colors">
                  Golghar
                </Link>
              </li>
              <li>
                <Link href="#areas" className="hover:text-emerald-400 transition-colors">
                  Raptinagar
                </Link>
              </li>
              <li>
                <Link href="#areas" className="hover:text-emerald-400 transition-colors">
                  Medical Road
                </Link>
              </li>
              <li>
                <Link href="#areas" className="hover:text-emerald-400 transition-colors">
                  Basharatpur
                </Link>
              </li>
              <li>
                <Link href="#areas" className="hover:text-emerald-400 transition-colors">
                  Mohaddipur
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 (Gorakhpur Helpline)</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@homliz.com</span>
              </li>
            </ul>

            <div className="pt-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Connect with us</span>
              <div className="flex items-center space-x-2">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                  <span
                    key={social}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-colors"
                  >
                    {social}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HOMLIZ. Gorakhpur, UP, India. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Gorakhpur Listings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

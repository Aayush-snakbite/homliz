'use client';

import React from 'react';
import { SearchBar } from '../ui/SearchBar';
import { IMAGES } from '@/lib/images';
import { MapPin, ShieldCheck, Sparkles, Building2, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { FilterState } from '@/types/property';

interface HeroProps {
  onSearch?: (filters: FilterState) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 flex flex-col justify-center overflow-hidden bg-[#080C14]">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-emerald-300 uppercase">
              Gorakhpur&apos;s Dedicated Local Real-Estate Marketplace
            </span>
          </div>
        </motion.div>

        {/* Main Headline & Lead */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Find a place that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              feels like home.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            HOMLIZ connects tenants with verified residential flats, independent houses, and prime commercial rental spaces across Gorakhpur, Uttar Pradesh.
          </motion.p>
        </div>

        {/* Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <SearchBar onSearch={onSearch} />
        </motion.div>

        {/* Hero Visual Card Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F1626] aspect-[21/9] max-h-[420px] w-full"
        >
          <img
            src={IMAGES.hero.main}
            alt={IMAGES.hero.alt}
            className="w-full h-full object-cover brightness-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/40 to-transparent" />

          {/* Floating Context Badges */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div className="bg-[#0E1626]/90 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center space-x-3 max-w-sm">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Prime Localities</span>
                <span className="text-xs text-slate-300">Civil Lines, Golghar, Raptinagar & more</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6 bg-[#0E1626]/90 backdrop-blur-md border border-white/15 py-3 px-6 rounded-2xl text-xs font-semibold text-slate-200">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Residential Rentals</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Commercial Spaces</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Direct Owner Enquiries</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

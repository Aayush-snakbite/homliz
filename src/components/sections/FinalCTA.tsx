'use client';

import React from 'react';
import { ArrowRight, PlusCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinalCTA: React.FC = () => {
  const scrollToProperties = () => {
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#080C14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F1626] via-[#121B2F] to-[#0B111E] border border-white/15 p-8 sm:p-14 text-center shadow-2xl"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-3">
            Get Started Today
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto mb-6 leading-tight">
            Looking for a place in Gorakhpur?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you need a modern residential flat, independent house, or a commercial space for your business, discover your ideal space on HOMLIZ.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToProperties}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-emerald-500/20 hover:scale-105"
            >
              <Search className="w-5 h-5" />
              <span>Explore Properties</span>
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl border border-white/20 transition-all hover:scale-105">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>List Your Property</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

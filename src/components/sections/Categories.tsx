'use client';

import React from 'react';
import { IMAGES } from '@/lib/images';
import { Home, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoriesProps {
  onSelectCategory?: (category: 'residential' | 'commercial') => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const handleClick = (category: 'residential' | 'commercial') => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
            Explore Rentals by Type
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Property Categories
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Whether you are looking for a cozy home for your family or a high-footfall commercial shop for your business in Gorakhpur, we have you covered.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Residential Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => handleClick('residential')}
            className="group relative rounded-3xl overflow-hidden bg-[#0F1626] border border-white/10 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer min-h-[380px] flex flex-col justify-end p-8"
          >
            <img
              src={IMAGES.categories.residential.url}
              alt={IMAGES.categories.residential.alt}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/70 to-transparent" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 backdrop-blur-md">
                <Home className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                For Families & Individuals
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-400 transition-colors mb-2">
                Residential Properties
              </h3>

              <p className="text-sm text-slate-300 mb-6 max-w-md leading-relaxed">
                Apartments, independent builder floors, family houses, and executive villas across Civil Lines, Raptinagar, Basharatpur & more.
              </p>

              <div className="inline-flex items-center space-x-2 bg-emerald-500 group-hover:bg-emerald-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                <span>Browse Residential</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Commercial Category */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => handleClick('commercial')}
            className="group relative rounded-3xl overflow-hidden bg-[#0F1626] border border-white/10 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer min-h-[380px] flex flex-col justify-end p-8"
          >
            <img
              src={IMAGES.categories.commercial.url}
              alt={IMAGES.categories.commercial.alt}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/70 to-transparent" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-4 backdrop-blur-md">
                <Building2 className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                For Retail & Businesses
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-400 transition-colors mb-2">
                Commercial Properties
              </h3>

              <p className="text-sm text-slate-300 mb-6 max-w-md leading-relaxed">
                Main market retail shops, modern office floors, medical clinics, and prime showrooms in Golghar, Medical Road & Mohaddipur.
              </p>

              <div className="inline-flex items-center space-x-2 bg-white/10 hover:bg-emerald-500 text-white hover:text-slate-950 font-bold py-3 px-6 rounded-xl border border-white/20 hover:border-emerald-500 transition-all">
                <span>Browse Commercial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

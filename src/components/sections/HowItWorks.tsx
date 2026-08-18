'use client';

import React from 'react';
import { Search, Eye, PhoneCall, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Search',
      description: 'Find residential and commercial properties based on your preferred Gorakhpur locality, type, and monthly budget.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Explore',
      description: 'View full property specifications, authentic photography, listed amenities, and clear rental pricing.',
      icon: Eye,
    },
    {
      number: '03',
      title: 'Connect',
      description: 'Contact property owners or our local Gorakhpur team directly to schedule on-site visits and finalize rental terms.',
      icon: PhoneCall,
    },
  ];

  return (
    <section className="py-24 bg-[#0B111E] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            How HOMLIZ Works
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Renting residential or commercial property in Gorakhpur has never been this straightforward.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-[#0F1626] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between relative"
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors shadow-md">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-black text-white/20 group-hover:text-emerald-400/30 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Step {step.number} of 03</span>
                  {idx < 2 && (
                    <ArrowRight className="w-4 h-4 text-emerald-400 hidden md:block group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

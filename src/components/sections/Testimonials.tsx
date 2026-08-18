'use client';

import React from 'react';
import { DEMO_TESTIMONIALS } from '@/data/testimonials';
import { Star, Quote, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-[#0B111E] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
              Early Feedback & Sample Reviews
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            What People Say About HOMLIZ
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Here is sample feedback from local Gorakhpur landlords, doctors, and business owners previewing the platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEMO_TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#0F1626] border border-white/10 rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 relative group"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-200 leading-relaxed italic mb-6 font-normal">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-emerald-400 font-medium">
                    {testimonial.role} • {testimonial.locality}
                  </p>
                </div>
                <Quote className="w-6 h-6 text-slate-600 group-hover:text-emerald-500/40 transition-colors shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

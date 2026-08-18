'use client';

import React from 'react';
import { MapPin, FileCheck, Compass, Layers, MessageSquare, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhyHomliz: React.FC = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Local Gorakhpur Focus',
      description: 'Built specifically for Gorakhpur localities, understanding neighborhood nuances and specific local rental requirements.',
    },
    {
      icon: FileCheck,
      title: 'Clear Property Details',
      description: 'Accurate pricing, clear bed/bath specs, exact area measurements, and upfront amenity information with zero hidden costs.',
    },
    {
      icon: Compass,
      title: 'Effortless Discovery',
      description: 'Filter instantly by locality (Civil Lines, Golghar, Raptinagar), budget limits, and property type without hassle.',
    },
    {
      icon: Layers,
      title: 'Residential & Commercial',
      description: 'Whether searching for family apartments, independent houses, retail shops, or office spaces, all options are under one roof.',
    },
    {
      icon: MessageSquare,
      title: 'Direct Enquiry Channel',
      description: 'Connect directly with property owners or our local representatives without going through unhelpful middle layers.',
    },
    {
      icon: HeartHandshake,
      title: 'On-Ground Assistance',
      description: 'Our team is locally present in Gorakhpur to guide on-site property walkthroughs and ensure smooth rental transitions.',
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Why HOMLIZ is Gorakhpur&apos;s Preferred Choice
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We focus strictly on providing a trustworthy, clean, and modern real-estate rental experience tailored to Gorakhpur residents and business owners.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[#0F1626] border border-white/10 rounded-2xl p-7 hover:border-emerald-500/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

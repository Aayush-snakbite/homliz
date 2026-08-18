'use client';

import React from 'react';
import { Building, MapPin, Layers, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export const TrustStats: React.FC = () => {
  const stats = [
    {
      id: 'stat-1',
      value: '20+',
      label: 'Curated Properties',
      sublabel: 'Active local rental listings',
      icon: Building,
    },
    {
      id: 'stat-2',
      value: '12+',
      label: 'Gorakhpur Areas',
      sublabel: 'Prime local neighborhoods',
      icon: MapPin,
    },
    {
      id: 'stat-3',
      value: '2-in-1',
      label: 'Residential & Commercial',
      sublabel: 'Flats, houses, shops & offices',
      icon: Layers,
    },
    {
      id: 'stat-4',
      value: '100%',
      label: 'Local Support',
      sublabel: 'Dedicated Gorakhpur team',
      icon: Headphones,
    },
  ];

  return (
    <section className="py-14 bg-[#0B111E] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0F1626] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                    {stat.value}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mb-0.5">
                  {stat.label}
                </h4>
                <p className="text-xs text-slate-400">
                  {stat.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

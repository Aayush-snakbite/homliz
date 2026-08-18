'use client';

import React from 'react';
import { GORAKHPUR_AREAS } from '@/data/areas';
import { AreaCard } from '../ui/AreaCard';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface GorakhpurAreasProps {
  onSelectArea?: (areaName: string) => void;
}

export const GorakhpurAreas: React.FC<GorakhpurAreasProps> = ({ onSelectArea }) => {
  return (
    <section id="areas" className="py-24 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <MapPin className="w-4 h-4" />
            <span>Local Neighborhoods</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Explore Gorakhpur Localities
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover active rental listings in Gorakhpur&apos;s most sought-after residential and commercial sectors.
          </p>
        </div>

        {/* Locality Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {GORAKHPUR_AREAS.map((area, idx) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <AreaCard area={area} onClickArea={onSelectArea} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

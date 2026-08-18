'use client';

import React from 'react';
import { GorakhpurArea } from '@/types/property';
import { MapPin, ArrowRight } from 'lucide-react';

interface AreaCardProps {
  area: GorakhpurArea;
  onClickArea?: (areaName: string) => void;
}

export const AreaCard: React.FC<AreaCardProps> = ({ area, onClickArea }) => {
  return (
    <div
      onClick={() => onClickArea?.(area.name)}
      className="group relative rounded-2xl overflow-hidden bg-[#0F1626] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer aspect-[4/3] flex flex-col justify-end"
    >
      {/* Background Image */}
      <img
        src={area.image}
        alt={`${area.name} - Gorakhpur`}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90"
        loading="lazy"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/60 to-transparent" />

      {/* Badge Top */}
      <div className="absolute top-3 left-3 z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
          {area.type}
        </span>
      </div>

      {/* Content Bottom */}
      <div className="relative z-10 p-5 flex flex-col justify-end">
        <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Gorakhpur Locality</span>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
          {area.name}
        </h3>

        <p className="text-xs text-slate-300 line-clamp-1 mb-3">
          {area.tagline}
        </p>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-slate-300 font-semibold">
            {area.propertyCount}+ Listed Properties
          </span>
          <span className="text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

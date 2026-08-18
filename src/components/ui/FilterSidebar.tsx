'use client';

import React from 'react';
import { FilterState } from '@/types/property';
import { Filter, RotateCcw, Search, MapPin, Building2, IndianRupee, Bed, Sofa, ArrowUpDown } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updatedFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange, onReset }) => {
  const handleInputChange = (field: keyof FilterState, value: any) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-5 space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2 text-white font-bold text-base">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Filter Properties</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Search Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. 3 BHK, Shop, Civil Lines..."
            value={filters.searchQuery}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* 2. Property Type (Category) */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Property Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'residential', label: 'Residential' },
            { id: 'commercial', label: 'Commercial' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => handleInputChange('propertyType', type.id)}
              className={`py-2 px-2 rounded-xl text-xs font-medium transition-all ${
                filters.propertyType === type.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Locality */}
      <div>
        <label htmlFor="filter-locality" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Locality
        </label>
        <select
          id="filter-locality"
          value={filters.searchLocation}
          onChange={(e) => handleInputChange('searchLocation', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
        >
          <option value="all" className="bg-[#0F1626] text-white">All Gorakhpur Areas</option>
          <option value="Civil Lines" className="bg-[#0F1626] text-white">Civil Lines</option>
          <option value="Golghar" className="bg-[#0F1626] text-white">Golghar</option>
          <option value="Raptinagar" className="bg-[#0F1626] text-white">Raptinagar</option>
          <option value="Medical Road" className="bg-[#0F1626] text-white">Medical Road</option>
          <option value="Basharatpur" className="bg-[#0F1626] text-white">Basharatpur</option>
          <option value="Mohaddipur" className="bg-[#0F1626] text-white">Mohaddipur</option>
          <option value="Taramandal" className="bg-[#0F1626] text-white">Taramandal</option>
          <option value="Betiahata" className="bg-[#0F1626] text-white">Betiahata</option>
        </select>
      </div>

      {/* 4. Rent Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Monthly Rent Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 mb-1 block">Min Rent</span>
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minRent || ''}
              onChange={(e) => handleInputChange('minRent', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 mb-1 block">Max Rent</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxRent || ''}
              onChange={(e) => handleInputChange('maxRent', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Bedrooms (BHK) */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Bed className="w-3.5 h-3.5 text-emerald-400" /> Bedrooms (BHK)
        </label>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {[
            { value: 0, label: 'Any' },
            { value: 1, label: '1 BHK' },
            { value: 2, label: '2 BHK' },
            { value: 3, label: '3 BHK' },
            { value: 4, label: '4+ BHK' },
          ].map((bhk) => (
            <button
              key={bhk.value}
              onClick={() => handleInputChange('bedrooms', bhk.value)}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium shrink-0 transition-all ${
                filters.bedrooms === bhk.value
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {bhk.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Furnishing */}
      <div>
        <label htmlFor="filter-furnishing" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sofa className="w-3.5 h-3.5 text-emerald-400" /> Furnishing Status
        </label>
        <select
          id="filter-furnishing"
          value={filters.furnishing}
          onChange={(e) => handleInputChange('furnishing', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
        >
          <option value="all" className="bg-[#0F1626] text-white">All Furnishing Types</option>
          <option value="Unfurnished" className="bg-[#0F1626] text-white">Unfurnished</option>
          <option value="Semi-Furnished" className="bg-[#0F1626] text-white">Semi-Furnished</option>
          <option value="Fully Furnished" className="bg-[#0F1626] text-white">Fully Furnished</option>
        </select>
      </div>

      {/* 7. Sort Order */}
      <div>
        <label htmlFor="filter-sort" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" /> Sort By
        </label>
        <select
          id="filter-sort"
          value={filters.sortBy}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
        >
          <option value="newest" className="bg-[#0F1626] text-white">Newest First</option>
          <option value="rent-asc" className="bg-[#0F1626] text-white">Lowest Rent First</option>
          <option value="rent-desc" className="bg-[#0F1626] text-white">Highest Rent First</option>
        </select>
      </div>
    </div>
  );
};

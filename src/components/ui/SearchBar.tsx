'use client';

import React, { useState } from 'react';
import { Search, MapPin, Building2, IndianRupee } from 'lucide-react';
import { FilterState } from '@/types/property';

interface SearchBarProps {
  onSearch?: (filters: FilterState) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('all');
  const [propertyType, setPropertyType] = useState<'all' | 'residential' | 'commercial'>('all');
  const [maxBudget, setMaxBudget] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filterObj: FilterState = {
      searchQuery: '',
      searchLocation: location,
      propertyType,
      subType: 'all',
      minRent: 0,
      maxRent: maxBudget,
      maxBudget,
      bedrooms: 0,
      furnishing: 'all',
      sortBy: 'newest',
    };

    if (onSearch) {
      onSearch(filterObj);
    } else {
      const el = document.getElementById('properties');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0E1626]/90 backdrop-blur-lg border border-white/10 p-3 sm:p-4 rounded-2xl shadow-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Locality Selector */}
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 hover:border-emerald-500/40 transition-colors">
          <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-search-locality" className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Location</label>
            <select
              id="hero-search-locality"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0E1626] text-white">All Gorakhpur Areas</option>
              <option value="Civil Lines" className="bg-[#0E1626] text-white">Civil Lines</option>
              <option value="Golghar" className="bg-[#0E1626] text-white">Golghar</option>
              <option value="Raptinagar" className="bg-[#0E1626] text-white">Raptinagar</option>
              <option value="Medical Road" className="bg-[#0E1626] text-white">Medical Road</option>
              <option value="Basharatpur" className="bg-[#0E1626] text-white">Basharatpur</option>
              <option value="Mohaddipur" className="bg-[#0E1626] text-white">Mohaddipur</option>
              <option value="Taramandal" className="bg-[#0E1626] text-white">Taramandal</option>
              <option value="Betiahata" className="bg-[#0E1626] text-white">Betiahata</option>
            </select>
          </div>
        </div>

        {/* Property Type Selector */}
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 hover:border-emerald-500/40 transition-colors">
          <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-search-type" className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Property Type</label>
            <select
              id="hero-search-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as any)}
              className="w-full bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0E1626] text-white">All Categories</option>
              <option value="residential" className="bg-[#0E1626] text-white">Residential</option>
              <option value="commercial" className="bg-[#0E1626] text-white">Commercial</option>
            </select>
          </div>
        </div>

        {/* Budget Selector */}
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 hover:border-emerald-500/40 transition-colors">
          <IndianRupee className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-search-budget" className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Max Budget</label>
            <select
              id="hero-search-budget"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-[#0E1626] text-white">Any Budget</option>
              <option value={15000} className="bg-[#0E1626] text-white">Up to ₹15,000/mo</option>
              <option value={25000} className="bg-[#0E1626] text-white">Up to ₹25,000/mo</option>
              <option value={40000} className="bg-[#0E1626] text-white">Up to ₹40,000/mo</option>
              <option value={60000} className="bg-[#0E1626] text-white">Up to ₹60,000/mo</option>
            </select>
          </div>
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Search className="w-5 h-5" />
          <span>Search Rentals</span>
        </button>
      </form>
    </div>
  );
};

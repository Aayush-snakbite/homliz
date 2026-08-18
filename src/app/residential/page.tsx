'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { GORAKHPUR_PROPERTIES } from '@/data/properties';
import { Home, Search, MapPin, Filter, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResidentialPage() {
  const [subCategory, setSubCategory] = useState<string>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const residentialProperties = useMemo(() => {
    return GORAKHPUR_PROPERTIES.filter((p) => {
      if (p.type !== 'residential') return false;

      // SubCategory filter
      if (subCategory !== 'all') {
        if (subCategory === 'Apartment' && p.subType !== 'Apartment' && p.subType !== 'Builder Floor') return false;
        if (subCategory === 'House' && p.subType !== 'Independent House') return false;
        if (subCategory === 'Villa' && p.subType !== 'Villa') return false;
        if (subCategory === 'PG' && p.subType !== 'PG / Room') return false;
      }

      // Locality filter
      if (selectedLocality !== 'all' && p.location !== selectedLocality) return false;

      // Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [subCategory, selectedLocality, searchQuery]);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Home className="w-4 h-4" />
              <span>Residential Collection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Residential Rentals in Gorakhpur
            </h1>
            <p className="text-sm text-slate-300">
              Discover verified apartments, builder floors, family houses, villas, and PG rooms across Gorakhpur localities.
            </p>
          </div>

          {/* Sub-Category Pills & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-[#0F1626] border border-white/10 p-1.5 rounded-2xl">
              {[
                { id: 'all', label: 'All Residential' },
                { id: 'Apartment', label: 'Flats & Apartments' },
                { id: 'House', label: 'Independent Houses' },
                { id: 'Villa', label: 'Villas' },
                { id: 'PG', label: 'PG & Rooms' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSubCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    subCategory === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Locality Selector & Search */}
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2 bg-[#0F1626] border border-white/10 px-3 py-2 rounded-xl text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0F1626]">All Localities</option>
                  <option value="Civil Lines" className="bg-[#0F1626]">Civil Lines</option>
                  <option value="Golghar" className="bg-[#0F1626]">Golghar</option>
                  <option value="Raptinagar" className="bg-[#0F1626]">Raptinagar</option>
                  <option value="Medical Road" className="bg-[#0F1626]">Medical Road</option>
                  <option value="Basharatpur" className="bg-[#0F1626]">Basharatpur</option>
                  <option value="Taramandal" className="bg-[#0F1626]">Taramandal</option>
                  <option value="Betiahata" className="bg-[#0F1626]">Betiahata</option>
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search home..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0F1626] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Property Grid */}
          {residentialProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {residentialProperties.map((property, idx) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 bg-[#0F1626] border border-white/10 rounded-3xl max-w-md mx-auto">
              <Home className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Residential Properties Found</h3>
              <p className="text-xs text-slate-400 mb-6">
                Try selecting &ldquo;All Residential&rdquo; or clearing locality filters to view available home rentals in Gorakhpur.
              </p>
              <button
                onClick={() => {
                  setSubCategory('all');
                  setSelectedLocality('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

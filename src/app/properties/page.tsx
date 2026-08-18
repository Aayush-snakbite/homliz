'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FilterSidebar } from '@/components/ui/FilterSidebar';
import { FilterDrawer } from '@/components/ui/FilterDrawer';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { GORAKHPUR_PROPERTIES } from '@/data/properties';
import { FilterState } from '@/types/property';
import { Filter, Search, RotateCcw, X, Building2, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const initialFilters: FilterState = {
  searchQuery: '',
  searchLocation: 'all',
  propertyType: 'all',
  subType: 'all',
  minRent: 0,
  maxRent: 0,
  bedrooms: 0,
  furnishing: 'all',
  sortBy: 'newest',
};

export default function PropertiesPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const resetFilters = () => setFilters(initialFilters);

  // Dynamic filter engine
  const filteredProperties = useMemo(() => {
    let result = [...GORAKHPUR_PROPERTIES];

    // Keyword Search
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subType.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    // Property Type
    if (filters.propertyType !== 'all') {
      result = result.filter((p) => p.type === filters.propertyType);
    }

    // Locality
    if (filters.searchLocation !== 'all') {
      result = result.filter(
        (p) => p.location.toLowerCase() === filters.searchLocation.toLowerCase()
      );
    }

    // SubType
    if (filters.subType !== 'all') {
      result = result.filter((p) => p.subType === filters.subType);
    }

    // Min Rent
    if (filters.minRent > 0) {
      result = result.filter((p) => p.rent >= filters.minRent);
    }

    // Max Rent
    if (filters.maxRent > 0) {
      result = result.filter((p) => p.rent <= filters.maxRent);
    }

    // Bedrooms
    if (filters.bedrooms > 0) {
      if (filters.bedrooms === 4) {
        result = result.filter((p) => p.bedrooms && p.bedrooms >= 4);
      } else {
        result = result.filter((p) => p.bedrooms === filters.bedrooms);
      }
    }

    // Furnishing
    if (filters.furnishing !== 'all') {
      result = result.filter((p) => p.furnishing === filters.furnishing);
    }

    // Sorting
    if (filters.sortBy === 'rent-asc') {
      result.sort((a, b) => a.rent - b.rent);
    } else if (filters.sortBy === 'rent-desc') {
      result.sort((a, b) => b.rent - a.rent);
    } else {
      // Newest first
      result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    return result;
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Gorakhpur Rental Properties
            </h1>
            <p className="text-sm text-slate-300">
              Browse available residential flats, independent houses, and commercial spaces across Gorakhpur.
            </p>
          </div>

          {/* Controls Bar for Mobile & Results Counter */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-xs text-slate-300 font-medium">
              Showing <span className="text-emerald-400 font-bold">{filteredProperties.length}</span> of {GORAKHPUR_PROPERTIES.length} rental listings
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 bg-[#0F1626] border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white hover:border-emerald-500 transition-colors"
            >
              <Filter className="w-4 h-4 text-emerald-400" />
              <span>Filters</span>
            </button>
          </div>

          {/* Active Filter Badges */}
          {(filters.searchQuery ||
            filters.searchLocation !== 'all' ||
            filters.propertyType !== 'all' ||
            filters.minRent > 0 ||
            filters.maxRent > 0 ||
            filters.bedrooms > 0 ||
            filters.furnishing !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#0F1626] border border-white/10 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Filters:</span>
              
              {filters.searchQuery && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                  &ldquo;{filters.searchQuery}&rdquo;
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, searchQuery: '' })} />
                </span>
              )}

              {filters.searchLocation !== 'all' && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                  Location: {filters.searchLocation}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, searchLocation: 'all' })} />
                </span>
              )}

              {filters.propertyType !== 'all' && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                  Type: {filters.propertyType}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, propertyType: 'all' })} />
                </span>
              )}

              {filters.maxRent > 0 && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                  Max: ₹{filters.maxRent}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, maxRent: 0 })} />
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-white underline ml-auto font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Layout Grid (Desktop Sidebar + Main Property Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                />
              </div>
            </div>

            {/* Main Property Catalog */}
            <div className="lg:col-span-3">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, idx) => (
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
                /* Professional Empty State */
                <div className="text-center py-20 px-6 bg-[#0F1626] border border-white/10 rounded-3xl max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    No active rental listings matched your current filter criteria in Gorakhpur. Try expanding your search budget or selecting another locality.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />

      <Footer />
    </div>
  );
}

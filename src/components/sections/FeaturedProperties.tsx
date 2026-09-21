'use client';

import React, { useState, useMemo } from 'react';
import { tenantDataService } from '@/lib/tenantData';
import { PropertyCard } from '../ui/PropertyCard';
import { FilterState } from '@/types/property';
import { Building2, Home, Sparkles, FilterX } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeaturedPropertiesProps {
  externalFilter?: FilterState | null;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ externalFilter }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'residential' | 'commercial'>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');

  // Filter properties dynamically
  const filteredProperties = useMemo(() => {
    return tenantDataService.getPublicProperties().filter((prop) => {
      // External search bar override
      if (externalFilter) {
        if (externalFilter.propertyType !== 'all' && prop.type !== externalFilter.propertyType) {
          return false;
        }
        if (externalFilter.searchLocation !== 'all' && prop.location.toLowerCase() !== externalFilter.searchLocation.toLowerCase()) {
          return false;
        }
        const effectiveMax = externalFilter.maxRent || externalFilter.maxBudget || 0;
        if (effectiveMax > 0 && prop.rent > effectiveMax) {
          return false;
        }
      }

      // Tab filter
      if (activeTab !== 'all' && prop.type !== activeTab) {
        return false;
      }

      // Locality sub-filter
      if (selectedLocality !== 'all' && prop.location !== selectedLocality) {
        return false;
      }

      return true;
    });
  }, [activeTab, selectedLocality, externalFilter]);

  return (
    <section id="properties" className="py-24 bg-[#0B111E] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Gorakhpur Rental Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Properties
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0F1626] border border-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              All Listings ({tenantDataService.getPublicProperties().length})
            </button>
            <button
              onClick={() => setActiveTab('residential')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'residential'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Residential</span>
            </button>
            <button
              onClick={() => setActiveTab('commercial')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'commercial'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Commercial</span>
            </button>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty Filter State */
          <div className="text-center py-16 px-4 bg-[#0F1626] border border-white/10 rounded-3xl max-w-lg mx-auto">
            <FilterX className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Matching Properties Found</h3>
            <p className="text-sm text-slate-400 mb-6">
              Try adjusting your search budget or locality filters to explore available rentals in Gorakhpur.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedLocality('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

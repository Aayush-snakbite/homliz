'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TrustStats } from '@/components/sections/TrustStats';
import { Categories } from '@/components/sections/Categories';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { GorakhpurAreas } from '@/components/sections/GorakhpurAreas';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { WhyHomliz } from '@/components/sections/WhyHomliz';
import { Testimonials } from '@/components/sections/Testimonials';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/layout/Footer';
import { FilterState } from '@/types/property';

const defaultFilterState: FilterState = {
  searchQuery: '',
  searchLocation: 'all',
  propertyType: 'all',
  subType: 'all',
  minRent: 0,
  maxRent: 0,
  maxBudget: 0,
  bedrooms: 0,
  furnishing: 'all',
  sortBy: 'newest',
};

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterState | null>(null);

  const handleHeroSearch = (filters: FilterState) => {
    setActiveFilter(filters);
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: 'residential' | 'commercial') => {
    setActiveFilter({
      ...defaultFilterState,
      propertyType: category,
    });
  };

  const handleAreaSelect = (areaName: string) => {
    setActiveFilter({
      ...defaultFilterState,
      searchLocation: areaName,
    });
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section with SearchBar */}
        <Hero onSearch={handleHeroSearch} />

        {/* Modest Scale Trust / Stats Bar */}
        <TrustStats />

        {/* Residential & Commercial Categories */}
        <Categories onSelectCategory={handleCategorySelect} />

        {/* Featured Property Grid */}
        <FeaturedProperties externalFilter={activeFilter} />

        {/* Gorakhpur Locality Showcase */}
        <GorakhpurAreas onSelectArea={handleAreaSelect} />

        {/* 3 Step Process */}
        <HowItWorks />

        {/* Why HOMLIZ Trust Section */}
        <WhyHomliz />

        {/* Testimonials */}
        <Testimonials />

        {/* Final CTA Banner */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

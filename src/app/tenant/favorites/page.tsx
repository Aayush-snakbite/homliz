'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { useAuth } from '@/context/AuthContext';
import { tenantDataService } from '@/lib/tenantData';
import { Property } from '@/types/property';
import { Heart, Search, ArrowLeft, Trash2 } from 'lucide-react';

function SavedPropertiesContent() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  const loadFavorites = () => {
    if (user) {
      setSavedProperties(tenantDataService.getSavedProperties(user.id));
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tenant/dashboard" className="hover:text-emerald-400 transition-colors">
              Tenant Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Saved Properties</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-emerald-400/20" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  My Saved Properties
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                You have <span className="text-emerald-400 font-bold">{savedProperties.length}</span> property listing{savedProperties.length === 1 ? '' : 's'} saved in your wishlist.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/tenant/dashboard"
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/properties"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Browse More</span>
              </Link>
            </div>
          </div>

          {/* Grid of Saved Properties or Empty State */}
          {savedProperties.length === 0 ? (
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-slate-400 mx-auto flex items-center justify-center mb-5">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Your Saved List is Empty</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-md mx-auto">
                Explore thousands of verified residential and commercial properties in Gorakhpur and click the heart button on any property card to save it here.
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                <Search className="w-4 h-4" />
                <span>Explore Gorakhpur Properties</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onRemove={loadFavorites}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SavedPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={['tenant']}>
      <SavedPropertiesContent />
    </ProtectedRoute>
  );
}

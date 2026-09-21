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
import { PropertyEnquiry } from '@/types/tenant';
import {
  User as UserIcon,
  Heart,
  MessageSquare,
  Search,
  UserCheck,
  Edit3,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function TenantDashboardContent() {
  const { user } = useAuth();

  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>([]);

  const loadData = () => {
    if (user) {
      setSavedProperties(tenantDataService.getSavedProperties(user.id));
      setEnquiries(tenantDataService.getTenantEnquiries(user.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Verified Tenant Account
                    </span>
                    <span className="text-xs text-slate-400">Gorakhpur, UP</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Welcome back, {user.name}!
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> {user.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/tenant/profile"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>Edit Profile</span>
                </Link>

                <Link
                  href="/properties"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse Properties</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Link
              href="/tenant/favorites"
              className="bg-[#0F1626] border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">Saved Properties</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <Heart className="w-5 h-5 fill-emerald-400/20" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {savedProperties.length}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                View saved listings <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/tenant/enquiries"
              className="bg-[#0F1626] border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">Submitted Enquiries</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {enquiries.length}
              </div>
              <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
                Track enquiry statuses <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <div className="bg-[#0F1626] border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">Account Status</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-lg font-bold text-emerald-400 mb-1">
                Active Tenant
              </div>
              <span className="text-[11px] text-slate-400">
                Direct booking enabled in Gorakhpur
              </span>
            </div>

            <div className="bg-[#0F1626] border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">Preferred Location</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="text-lg font-bold text-white mb-1">
                Gorakhpur, UP
              </div>
              <span className="text-[11px] text-slate-400">
                Civil Lines, Golghar & nearby
              </span>
            </div>
          </div>

          {/* 2-Column Section: Saved Properties Preview & Recent Enquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Saved Properties Preview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                  <h2 className="text-xl font-bold text-white">Saved Properties</h2>
                </div>
                {savedProperties.length > 0 && (
                  <Link
                    href="/tenant/favorites"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View All ({savedProperties.length}) <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {savedProperties.length === 0 ? (
                <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 mx-auto flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">No Saved Properties Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                    Click the heart icon on any property in Gorakhpur to save it here for quick access later.
                  </p>
                  <Link
                    href="/properties"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                  >
                    <Search className="w-4 h-4" />
                    <span>Browse Properties Now</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedProperties.slice(0, 2).map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onRemove={loadData}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Recent Enquiries Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white">Recent Enquiries</h2>
                </div>
                {enquiries.length > 0 && (
                  <Link
                    href="/tenant/enquiries"
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    View All ({enquiries.length}) <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {enquiries.length === 0 ? (
                <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">No Enquiries Submitted</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    When you enquire about a property, direct status updates will appear here.
                  </p>
                  <Link
                    href="/properties"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    <span>Explore available listings</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.slice(0, 3).map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-[#0F1626] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link
                          href={`/properties/${enq.propertyId}`}
                          className="font-bold text-xs text-white hover:text-emerald-400 transition-colors line-clamp-1"
                        >
                          {enq.propertyTitle}
                        </Link>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            enq.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : enq.status === 'Contacted'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span>{enq.propertyLocation}, Gorakhpur</span>
                        <span className="font-semibold text-emerald-400">
                          ₹{enq.propertyRent.toLocaleString('en-IN')}/mo
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-2 bg-white/[0.02] p-2 rounded-lg border border-white/5 mb-2">
                        "{enq.message}"
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/properties/${enq.propertyId}`}
                          className="font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          View Property <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TenantDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['tenant']}>
      <TenantDashboardContent />
    </ProtectedRoute>
  );
}

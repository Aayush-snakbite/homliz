'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { ownerPropertiesService, isApprovedStatus, isPendingStatus, isRejectedStatus } from '@/lib/ownerProperties';
import { Property } from '@/types/property';
import {
  Building,
  PlusCircle,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  FileText,
  MapPin,
  IndianRupee,
  Home,
  UserCheck,
  Building2,
  ArrowRight,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

function OwnerDashboardContent() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (user?.id) {
      const list = ownerPropertiesService.getOwnerProperties(user.id);
      setProperties(list);
    }
  }, [user]);

  const totalCount = properties.length;
  const publishedCount = properties.filter((p) => isApprovedStatus(p.status)).length;
  const pendingCount = properties.filter((p) => isPendingStatus(p.status)).length;
  const rejectedCount = properties.filter((p) => isRejectedStatus(p.status)).length;

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner & Owner Info */}
          <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Property Owner
                    </span>
                    <span className="text-xs text-slate-400">Gorakhpur Partner</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {user?.name || 'Owner Dashboard'}
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    {user?.email} • {user?.phone || 'Gorakhpur, UP'}
                  </p>
                </div>
              </div>

              <Link
                href="/owner/properties/new"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Property</span>
              </Link>
            </div>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Listings</span>
                <Building className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{totalCount}</div>
              <p className="text-[10px] text-slate-400 mt-1">Properties in portfolio</p>
            </div>

            <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved / Live</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{publishedCount}</div>
              <p className="text-[10px] text-slate-400 mt-1">Visible on Gorakhpur catalog</p>
            </div>

            <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Review</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300">{pendingCount}</div>
              <p className="text-[10px] text-slate-400 mt-1">Under admin verification</p>
            </div>

            <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejected</span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400">{rejectedCount}</div>
              <p className="text-[10px] text-slate-400 mt-1">Needs editing or review</p>
            </div>
          </div>

          {/* Properties Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              My Property Listings ({totalCount})
            </h2>

            <Link
              href="/owner/properties/new"
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>+ Add Listing</span>
            </Link>
          </div>

          {/* Property List / Cards Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, idx) => {
                const isApp = isApprovedStatus(property.status);
                const isPend = isPendingStatus(property.status);
                const isRej = isRejectedStatus(property.status);
                const statusLabel = isPend ? 'Pending Review' : isApp ? 'Approved' : 'Rejected';

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-[#0F1626] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
                  >
                    <div>
                      {/* Property Image & Status Pill */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-black/30" />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-md ${
                              isApp
                                ? 'bg-emerald-500/90 text-slate-950'
                                : isPend
                                ? 'bg-amber-500/90 text-slate-950'
                                : 'bg-rose-500/90 text-white'
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        {/* Rent Tag */}
                        <div className="absolute bottom-3 left-3">
                          <span className="text-lg font-extrabold text-white">
                            ₹{property.rent.toLocaleString('en-IN')} <span className="text-xs text-emerald-300 font-normal">/ mo</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{property.location}, Gorakhpur</span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
                          {property.title}
                        </h3>

                        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2">
                          <span>{property.subType}</span>
                          <span>•</span>
                          <span>{property.areaSqFt} sq ft</span>
                          {property.bedrooms !== undefined && (
                            <>
                              <span>•</span>
                              <span>{property.bedrooms} BHK</span>
                            </>
                          )}
                        </div>

                        {isRej && property.rejectionReason && (
                          <div className="mt-2 text-[11px] p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                            <strong>Note:</strong> {property.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                      <Link
                        href={`/properties/${property.id}`}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View</span>
                      </Link>

                      <Link
                        href={`/owner/properties/${property.id}/edit`}
                        className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Listing</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 px-6 bg-[#0F1626] border border-white/10 rounded-3xl max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Properties Listed Yet</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                You haven&apos;t listed any residential or commercial rental properties in Gorakhpur yet. Click below to add your first property listing.
              </p>
              <Link
                href="/owner/properties/new"
                className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Your First Property</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OwnerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['property_owner']}>
      <OwnerDashboardContent />
    </ProtectedRoute>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { ownerPropertiesService, isApprovedStatus, isPendingStatus, isRejectedStatus } from '@/lib/ownerProperties';
import { tenantDataService } from '@/lib/tenantData';
import { Property } from '@/types/property';
import { AdminReviewModal } from '@/components/admin/AdminReviewModal';
import { RejectReasonModal } from '@/components/admin/RejectReasonModal';
import {
  Building,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Check,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

function AdminPropertiesContent() {
  const { user } = useAuth();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [rejectingPropertyId, setRejectingPropertyId] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = () => {
    const list = tenantDataService.getAllProperties();
    setAllProperties(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (propertyId: string) => {
    ownerPropertiesService.approveProperty(propertyId);
    loadData();
    setIsReviewOpen(false);
    showFeedback('Property approved and updated.');
  };

  const handleRejectPrompt = (propertyId: string) => {
    setRejectingPropertyId(propertyId);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason: string) => {
    if (rejectingPropertyId) {
      ownerPropertiesService.rejectProperty(rejectingPropertyId, reason);
      loadData();
      setIsRejectModalOpen(false);
      setIsReviewOpen(false);
      setRejectingPropertyId(null);
      showFeedback('Property listing rejected.');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter properties
  const filteredProperties = allProperties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contactName && p.contactName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedStatusFilter === 'pending') return isPendingStatus(p.status);
    if (selectedStatusFilter === 'approved') return isApprovedStatus(p.status);
    if (selectedStatusFilter === 'rejected') return isRejectedStatus(p.status);
    return true;
  });

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
            <Link href="/admin/dashboard" className="hover:text-emerald-400 transition-colors">
              Admin Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">All Properties</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Property Inventory Management
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Review, filter, approve, and moderate all properties listed across Gorakhpur.
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <span>{feedback}</span>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Controls Bar: Search & Status Filter Tabs */}
          <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, locality, or owner name..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-white/5 overflow-x-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${
                    selectedStatusFilter === tab
                      ? tab === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : tab === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : tab === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'pending' ? 'Pending' : tab === 'approved' ? 'Approved' : 'Rejected'}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Table / Grid */}
          {filteredProperties.length === 0 ? (
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No Properties Found</h3>
              <p className="text-xs text-slate-400">
                No properties match your current search or status filter.
              </p>
            </div>
          ) : (
            <div className="bg-[#0F1626] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Property</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Monthly Rent</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {filteredProperties.map((property) => {
                      const isApp = isApprovedStatus(property.status);
                      const isPend = isPendingStatus(property.status);
                      const isRej = isRejectedStatus(property.status);

                      return (
                        <tr key={property.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-white block max-w-xs truncate">
                                  {property.title}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Created: {property.createdAt || 'Demo'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-slate-300">
                            {property.subType}
                          </td>
                          <td className="p-4 font-medium text-slate-300">
                            {property.location}, Gorakhpur
                          </td>
                          <td className="p-4 font-bold text-emerald-400">
                            ₹{property.rent.toLocaleString('en-IN')}/mo
                          </td>
                          <td className="p-4 text-slate-300">
                            {property.contactName || 'Property Owner'}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
                                isPend
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : isApp
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {isPend ? 'Pending Review' : isApp ? 'Approved' : 'Rejected'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setIsReviewOpen(true);
                                }}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
                                title="Review Details"
                              >
                                <Eye className="w-4 h-4 text-emerald-400" />
                              </button>

                              {!isApp && (
                                <button
                                  onClick={() => handleApprove(property.id)}
                                  className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                                  title="Approve Listing"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}

                              {!isRej && (
                                <button
                                  onClick={() => handleRejectPrompt(property.id)}
                                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors"
                                  title="Reject Listing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Review Details Modal */}
      <AdminReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        property={selectedProperty}
        onApprove={handleApprove}
        onReject={handleRejectPrompt}
      />

      {/* Rejection Reason Modal */}
      <RejectReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        propertyTitle={
          allProperties.find((p) => p.id === rejectingPropertyId)?.title || 'Selected Property'
        }
      />

      <Footer />
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPropertiesContent />
    </ProtectedRoute>
  );
}

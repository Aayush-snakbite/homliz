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
  ShieldCheck,
  Building,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  Filter,
  Check,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

function AdminDashboardContent() {
  const { user } = useAuth();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
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

  const totalCount = allProperties.length;
  const pendingCount = allProperties.filter((p) => isPendingStatus(p.status)).length;
  const approvedCount = allProperties.filter((p) => isApprovedStatus(p.status)).length;
  const rejectedCount = allProperties.filter((p) => isRejectedStatus(p.status)).length;

  const pendingList = allProperties.filter((p) => isPendingStatus(p.status));

  const handleApprove = (propertyId: string) => {
    ownerPropertiesService.approveProperty(propertyId);
    loadData();
    setIsReviewOpen(false);
    showFeedback('Property successfully approved and published to public catalog!');
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
      showFeedback('Property listing rejected and marked on owner dashboard.');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Header Banner */}
          <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  <ShieldCheck className="w-8 h-8 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      HOMLIZ System Administrator
                    </span>
                    <span className="text-xs text-slate-400">Gorakhpur Marketplace</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Administrator Control Panel
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage property submissions, review moderation queues, and enforce site quality standards.
                  </p>
                </div>
              </div>

              {/* Quick Admin Navigation Tabs */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/admin/properties/pending"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>Pending Queue ({pendingCount})</span>
                </Link>

                <Link
                  href="/admin/properties"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors"
                >
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>All Properties ({totalCount})</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Feedback Toast Banner */}
          {feedback && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feedback}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Link
              href="/admin/properties"
              className="bg-[#0F1626] border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">Total Properties</span>
                <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-white/10">
                  <Building className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{totalCount}</div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                View all inventory <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/admin/properties/pending"
              className="bg-[#0F1626] border border-amber-500/30 hover:border-amber-500/60 p-5 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-amber-300">Pending Review</span>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-400 mb-1">{pendingCount}</div>
              <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                Action required <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/admin/properties?status=approved"
              className="bg-[#0F1626] border border-emerald-500/30 hover:border-emerald-500/60 p-5 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-300">Approved & Live</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-400 mb-1">{approvedCount}</div>
              <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                Visible on site <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/admin/properties?status=rejected"
              className="bg-[#0F1626] border border-rose-500/30 hover:border-rose-500/60 p-5 rounded-2xl transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-rose-300">Rejected Listings</span>
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-rose-400 mb-1">{rejectedCount}</div>
              <span className="text-[11px] text-rose-300 font-medium flex items-center gap-1">
                Hidden from public <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          {/* Pending Submissions Queue Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Pending Approvals Queue
                </h2>
                <p className="text-xs text-slate-400">
                  New submissions waiting for admin verification before public publishing.
                </p>
              </div>

              <Link
                href="/admin/properties/pending"
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                View Full Queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingList.length === 0 ? (
              <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Queue Clear! No Pending Submissions</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  All submitted property listings in Gorakhpur have been reviewed and moderated.
                </p>
              </div>
            ) : (
              <div className="bg-[#0F1626] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4">Property</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Monthly Rent</th>
                        <th className="p-4">Submitted By</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {pendingList.slice(0, 5).map((property) => (
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
                                <span className="text-[10px] text-emerald-400 font-semibold">
                                  {property.subType} • {property.type}
                                </span>
                              </div>
                            </div>
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
                          <td className="p-4 text-slate-400 text-[11px]">
                            {property.createdAt || 'Recent'}
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

                              <button
                                onClick={() => handleApprove(property.id)}
                                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => handleRejectPrompt(property.id)}
                                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[11px]"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
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

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

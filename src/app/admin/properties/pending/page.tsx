'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { ownerPropertiesService, isPendingStatus } from '@/lib/ownerProperties';
import { tenantDataService } from '@/lib/tenantData';
import { Property } from '@/types/property';
import { AdminReviewModal } from '@/components/admin/AdminReviewModal';
import { RejectReasonModal } from '@/components/admin/RejectReasonModal';
import {
  Clock,
  ArrowLeft,
  Eye,
  CheckCircle2,
  XCircle,
  Building,
  Check,
  X,
  MapPin,
  User,
  AlertCircle,
} from 'lucide-react';

function PendingApprovalsContent() {
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

  const pendingList = allProperties.filter((p) => isPendingStatus(p.status));

  const handleApprove = (propertyId: string) => {
    ownerPropertiesService.approveProperty(propertyId);
    loadData();
    setIsReviewOpen(false);
    showFeedback('Property successfully approved and published to public site!');
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
    setTimeout(() => setFeedback(null), 4000);
  };

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
            <span className="text-slate-200">Pending Approvals</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Pending Approvals Queue
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Review and moderate <span className="text-amber-400 font-bold">{pendingList.length}</span> property listing{pendingList.length === 1 ? '' : 's'} waiting for approval.
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
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

          {/* Pending Queue List or Empty State */}
          {pendingList.length === 0 ? (
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Properties Waiting for Approval</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-md mx-auto">
                All property submissions in Gorakhpur have been processed. New owner submissions will appear here automatically.
              </p>
              <Link
                href="/admin/properties"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs"
              >
                <Building className="w-4 h-4 text-emerald-400" />
                <span>View All Properties Inventory</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingList.map((property) => (
                <div
                  key={property.id}
                  className="bg-[#0F1626] border border-amber-500/30 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500 text-slate-950">
                          Pending Review
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white border border-white/10">
                          {property.subType}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{property.location}, Gorakhpur</span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                        {property.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {property.description}
                      </p>

                      <div className="flex items-center justify-between text-xs py-2.5 border-y border-white/10 mb-4 bg-white/[0.02] px-3 rounded-xl">
                        <span className="text-slate-400">Monthly Rent:</span>
                        <span className="text-base font-extrabold text-emerald-400">
                          ₹{property.rent.toLocaleString('en-IN')}/mo
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {property.contactName || 'Owner'}
                        </span>
                        <span>{property.createdAt || 'Recent'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-white/[0.02] border-t border-white/10 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setIsReviewOpen(true);
                      }}
                      className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => handleRejectPrompt(property.id)}
                      className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(property.id)}
                      className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
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

export default function PendingApprovalsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PendingApprovalsContent />
    </ProtectedRoute>
  );
}

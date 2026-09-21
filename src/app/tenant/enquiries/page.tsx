'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { tenantDataService } from '@/lib/tenantData';
import { PropertyEnquiry } from '@/types/tenant';
import {
  MessageSquare,
  ArrowLeft,
  Search,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';

function TenantEnquiriesContent() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>([]);

  useEffect(() => {
    if (user) {
      setEnquiries(tenantDataService.getTenantEnquiries(user.id));
    }
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
            <span className="text-slate-200">My Enquiries</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  My Submitted Enquiries
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Track status updates and direct responses for your property enquiries in Gorakhpur.
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
                <span>Find Properties</span>
              </Link>
            </div>
          </div>

          {/* Enquiries List or Empty State */}
          {enquiries.length === 0 ? (
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-slate-400 mx-auto flex items-center justify-center mb-5">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Enquiries Found</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-md mx-auto">
                You haven't submitted any enquiries yet. Browse properties on HOMLIZ and click "Send Direct Enquiry" to contact the property team.
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                <Search className="w-4 h-4" />
                <span>Browse Properties Now</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-[#0F1626] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-start space-x-4">
                      {enq.propertyImage ? (
                        <img
                          src={enq.propertyImage}
                          alt={enq.propertyTitle}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                          <Building className="w-6 h-6" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              enq.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : enq.status === 'Contacted'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}
                          >
                            Status: {enq.status}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            Submitted: {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <Link
                          href={`/properties/${enq.propertyId}`}
                          className="text-base font-bold text-white hover:text-emerald-400 transition-colors"
                        >
                          {enq.propertyTitle}
                        </Link>

                        <div className="flex items-center space-x-2 text-xs text-emerald-400 mt-0.5 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{enq.propertyLocation}, Gorakhpur</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-baseline md:items-end justify-between shrink-0">
                      <div className="text-xl font-extrabold text-emerald-400">
                        ₹{enq.propertyRent.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-400">/mo</span>
                      </div>
                      <Link
                        href={`/properties/${enq.propertyId}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-emerald-400 transition-colors mt-2"
                      >
                        <span>View Listing</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Message Detail Box */}
                  <div className="mt-4 pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Submitted Message
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      "{enq.message}"
                    </p>
                  </div>

                  {/* Contact Details Footer */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <span>Contact Name: <strong className="text-slate-200">{enq.tenantName}</strong></span>
                      <span>Phone: <strong className="text-slate-200">{enq.phone}</strong></span>
                      {enq.email && <span>Email: <strong className="text-slate-200">{enq.email}</strong></span>}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Logged with Gorakhpur HOMLIZ Support</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TenantEnquiriesPage() {
  return (
    <ProtectedRoute allowedRoles={['tenant']}>
      <TenantEnquiriesContent />
    </ProtectedRoute>
  );
}

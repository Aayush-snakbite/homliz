'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, MapPin, Building, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { tenantDataService } from '@/lib/tenantData';
import { Property } from '@/types/property';

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSuccess?: () => void;
}

export const EnquireModal: React.FC<EnquireModalProps> = ({
  isOpen,
  onClose,
  property,
  onSuccess,
}) => {
  const { user } = useAuth();

  const [tenantName, setTenantName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setTenantName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setMessage(
        `Hi, I am interested in renting "${property.title}" in ${property.location}. Please get in touch with me regarding availability and site visit.`
      );
    }
  }, [user, property]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tenantName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please provide a valid phone number so the team can reach you.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate network request delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      tenantDataService.addEnquiry({
        userId: user?.id || 'guest',
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyRent: property.rent,
        propertyType: property.type,
        propertyImage: property.image,
        tenantName: tenantName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || 'Interested in renting this property.',
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setIsSubmitting(false);
      setError('Failed to submit enquiry. Please try again.');
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0F1626] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Submit Property Enquiry</h3>
              <p className="text-xs text-slate-400">Gorakhpur HOMLIZ Direct Support</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Brief Bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300 truncate max-w-[260px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate">{property.title}</span>
          </div>
          <div className="font-bold text-emerald-400 shrink-0">
            ₹{property.rent.toLocaleString('en-IN')}/mo
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">Enquiry Submitted Successfully!</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Your enquiry for <span className="text-emerald-400 font-semibold">{property.title}</span> has been logged. You can track this under <span className="font-bold text-white">My Enquiries</span> in your dashboard.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g. Rahul Srivastava"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenant@homliz.com"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message / Requirements
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention your move-in date, family size, or special requirements..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Property } from '@/types/property';
import {
  X,
  CheckCircle2,
  XCircle,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Building,
  User,
  Phone,
  Calendar,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AdminReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onApprove: (propertyId: string) => void;
  onReject: (propertyId: string) => void;
}

export const AdminReviewModal: React.FC<AdminReviewModalProps> = ({
  isOpen,
  onClose,
  property,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0F1626] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Review Property Listing</h3>
              <p className="text-xs text-slate-400">Admin Quality Check & Moderation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Image Banner */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-500 text-slate-950">
                {property.subType}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-md bg-slate-900/80 text-white border border-white/15 backdrop-blur-md">
                {property.type}
              </span>
            </div>
          </div>

          {/* Title & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-extrabold text-white mb-1">{property.title}</h2>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{property.address}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Rent</div>
              <div className="text-2xl font-black text-emerald-400">
                ₹{property.rent.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-300">/mo</span>
              </div>
            </div>
          </div>

          {/* Property Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Bedrooms</span>
              <span className="text-base font-bold text-white">
                {property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Bathrooms</span>
              <span className="text-base font-bold text-white">{property.bathrooms || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Carpet Area</span>
              <span className="text-base font-bold text-white">{property.areaSqFt} sq ft</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Furnishing</span>
              <span className="text-sm font-bold text-white truncate block">
                {property.furnishing || 'Unfurnished'}
              </span>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Description & Overview
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Listed Amenities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Listed Amenities ({property.amenities.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Owner Details */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  {property.contactName || 'Property Owner'}
                </span>
                <span className="text-[11px] text-slate-400">{property.ownerType}</span>
              </div>
            </div>

            {property.contactPhone && (
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{property.contactPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10"
          >
            Close Review
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onReject(property.id)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Listing</span>
            </button>

            <button
              onClick={() => onApprove(property.id)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Listing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

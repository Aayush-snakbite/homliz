'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, ShieldX } from 'lucide-react';

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  propertyTitle: string;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyTitle,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason.trim() || 'Property details did not satisfy HOMLIZ marketplace guidelines.');
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0F1626] border border-rose-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-rose-500/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reject Property Listing</h3>
              <p className="text-[11px] text-slate-400">Admin Moderation Action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            You are rejecting <span className="font-bold text-white">"{propertyTitle}"</span>. The property will be removed from the approval queue and marked as <span className="text-rose-400 font-bold">Rejected</span> on the owner's dashboard.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reason for Rejection <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Incomplete address, unrealistic rent price, missing key amenities..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

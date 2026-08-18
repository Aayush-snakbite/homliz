'use client';

import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group">
        <img
          src={images[activeIdx]}
          alt={`${title} - photo ${activeIdx + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Expand Lightbox Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Expand image preview"
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950/70 backdrop-blur-md text-white border border-white/10 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Gallery Counter Tag */}
        <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-white border border-white/10">
          Photo {activeIdx + 1} of {images.length}
        </div>
      </div>

      {/* Thumbnail Switcher Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-[16/10] rounded-xl overflow-hidden border transition-all ${
                activeIdx === idx
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-6 p-3 rounded-full bg-white/10 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-6 p-3 rounded-full bg-white/10 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div className="max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
              <img
                src={images[activeIdx]}
                alt={title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Maximize2, Heart, ArrowRight, Sofa } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { tenantDataService } from '@/lib/tenantData';

interface PropertyCardProps {
  property: Property;
  onRemove?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onRemove }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setIsLiked(tenantDataService.isPropertySaved(user.id, property.id));
    } else {
      setIsLiked(false);
    }
  }, [user, property.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const nowSaved = tenantDataService.toggleSavedProperty(user.id, property.id);
    setIsLiked(nowSaved);

    if (!nowSaved && onRemove) {
      onRemove();
    }
  };

  return (
    <div className="group bg-[#0F1626] border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Link href={`/properties/${property.id}`} className="block w-full h-full">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-md ${
            property.type === 'residential'
              ? 'bg-emerald-500/90 text-slate-950 font-bold'
              : 'bg-indigo-500/90 text-white font-bold'
          }`}>
            {property.subType}
          </span>

          {property.furnishing && (
            <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-slate-200 border border-white/15 backdrop-blur-md">
              {property.furnishing}
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
            isLiked
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/50'
              : 'bg-slate-950/60 text-white border-white/10 hover:bg-emerald-500 hover:text-slate-950'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-emerald-400 text-emerald-400' : ''}`} />
        </button>

        {/* Rent Tag over Image */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <div className="text-xl font-extrabold text-white flex items-baseline gap-1">
            <span>₹{property.rent.toLocaleString('en-IN')}</span>
            <span className="text-xs font-medium text-emerald-300">/ month</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Location Pin */}
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{property.location}, Gorakhpur</span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.id}`}>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div>
          {/* Property Specs Pill Row */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 mb-4 bg-white/[0.02] rounded-xl px-3 text-center">
            {property.bedrooms !== undefined ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                  <Bed className="w-3 h-3 text-emerald-400" /> BHK
                </span>
                <span className="text-sm font-bold text-white">{property.bedrooms} BHK</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                  <Sofa className="w-3 h-3 text-indigo-400" /> Furnished
                </span>
                <span className="text-xs font-bold text-white truncate max-w-full">
                  {property.furnishing || 'Standard'}
                </span>
              </div>
            )}

            {property.bathrooms !== undefined ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                  <Bath className="w-3 h-3 text-emerald-400" /> Baths
                </span>
                <span className="text-sm font-bold text-white">{property.bathrooms}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Locality
                </span>
                <span className="text-xs font-bold text-white truncate max-w-full">
                  {property.location}
                </span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center col-span-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-emerald-400" /> Area
              </span>
              <span className="text-sm font-bold text-white">{property.areaSqFt} sqft</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {property.ownerType}
            </span>

            <Link
              href={`/properties/${property.id}`}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl font-semibold text-xs bg-white/5 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-white/10 hover:border-emerald-500 transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

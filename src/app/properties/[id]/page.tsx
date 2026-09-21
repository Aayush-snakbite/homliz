'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyGallery } from '@/components/ui/PropertyGallery';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { ScheduleVisitModal } from '@/components/ui/ScheduleVisitModal';
import { EnquireModal } from '@/components/ui/EnquireModal';
import { useAuth } from '@/context/AuthContext';
import { tenantDataService } from '@/lib/tenantData';
import { Property } from '@/types/property';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  Phone,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Building2,
  Home,
  Sofa,
  Clock,
  IndianRupee,
  Heart,
  Send,
} from 'lucide-react';

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const property = tenantDataService.getPropertyById(id);

  useEffect(() => {
    if (user && property) {
      setIsSaved(tenantDataService.isPropertySaved(user.id, property.id));
    }
  }, [user, property]);

  if (!property) {
    notFound();
  }

  // Gallery set
  const images = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];

  // Similar properties calculation
  const allProps = tenantDataService.getAllProperties();
  const similarProperties = allProps.filter(
    (p) => p.id !== property.id && (p.location === property.location || p.type === property.type)
  ).slice(0, 3);

  // Pre-filled WhatsApp link
  const whatsappMsg = encodeURIComponent(
    `Hello HOMLIZ Team, I am interested in renting "${property.title}" in ${property.location}, Gorakhpur (Rent: ₹${property.rent.toLocaleString('en-IN')}/mo). Please provide more details.`
  );
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMsg}`;

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

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
            <Link href="/properties" className="hover:text-emerald-400 transition-colors">
              Properties
            </Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-[200px]">{property.title}</span>
          </div>

          {/* Top Title & Quick Actions Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                  property.type === 'residential'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {property.subType}
                </span>
                {property.furnishing && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-white/10">
                    {property.furnishing}
                  </span>
                )}
                {property.isDemo && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo Listing
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                {property.title}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-emerald-400 font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </div>
            </div>

            {/* Share / Favorite / Back Buttons */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => {
                  if (!isAuthenticated || !user) {
                    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                    return;
                  }
                  const now = tenantDataService.toggleSavedProperty(user.id, property.id);
                  setIsSaved(now);
                }}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                  isSaved
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-white/5 border-white/10 text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-emerald-400 text-emerald-400' : 'text-emerald-400'}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleCopyShare}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
              </button>

              <Link
                href="/properties"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalog</span>
              </Link>
            </div>
          </div>

          {/* Main 2-Column Details Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Gallery, Specs & Description */}
            <div className="lg:col-span-2 space-y-10">
              {/* Photo Gallery Component */}
              <PropertyGallery images={images} title={property.title} />

              {/* Specs Grid Bar */}
              <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Monthly Rent
                  </span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    ₹{property.rent.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Security Deposit
                  </span>
                  <span className="text-lg font-bold text-white">
                    ₹{(property.securityDeposit || property.rent * 2).toLocaleString('en-IN')}
                  </span>
                </div>

                {property.bedrooms !== undefined ? (
                  <div className="p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      Bedrooms
                    </span>
                    <span className="text-lg font-bold text-white">{property.bedrooms} BHK</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      Property Category
                    </span>
                    <span className="text-sm font-bold text-white truncate block">{property.subType}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Carpet Area
                  </span>
                  <span className="text-lg font-bold text-white">{property.areaSqFt} sq ft</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Property Overview & Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line mb-6">
                  {property.description}
                </p>

                {/* Property Meta Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Locality Sector</span>
                    <span className="font-semibold text-white">{property.location}, Gorakhpur</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Furnishing</span>
                    <span className="font-semibold text-white">{property.furnishing || 'Unfurnished'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Available From</span>
                    <span className="font-semibold text-emerald-400">{property.availableFrom || 'Immediately'}</span>
                  </div>
                </div>
              </div>

              {/* Listed Amenities */}
              <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center space-x-2 bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-semibold text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Action Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
                {/* Pricing Summary Box */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-xs text-slate-400 mb-1 font-medium">Monthly Rent</div>
                  <div className="text-3xl font-black text-emerald-400">
                    ₹{property.rent.toLocaleString('en-IN')} <span className="text-xs text-slate-300 font-normal">/ month</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-white/10">
                    <span>Security Deposit:</span>
                    <span className="font-semibold text-white">₹{(property.securityDeposit || property.rent * 2).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Owner/Rep Badge */}
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{property.ownerType} Verified</span>
                    <span className="text-slate-300 text-[11px]">Direct enquiry line active in Gorakhpur</span>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="space-y-3">
                  {/* Direct Enquiry Modal Action */}
                  <button
                    onClick={() => {
                      if (!isAuthenticated || !user) {
                        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                        return;
                      }
                      setIsEnquireModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Direct Enquiry</span>
                  </button>

                  {/* WhatsApp Action */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs border border-white/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Enquire via WhatsApp</span>
                  </a>

                  {/* Direct Call Action */}
                  <a
                    href="tel:+919876543210"
                    className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs border border-white/10 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call +91 98765 43210</span>
                  </a>

                  {/* Schedule Walkthrough Visit */}
                  <button
                    onClick={() => setIsVisitModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold py-3 px-4 rounded-xl text-xs border border-white/10 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Schedule On-Site Visit</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 text-center leading-relaxed">
                  No advance booking fee required. Arrange property viewing directly with the local Gorakhpur team.
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties Section */}
          {similarProperties.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">
                Similar Properties in Gorakhpur
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProperties.map((simProp) => (
                  <PropertyCard key={simProp.id} property={simProp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Schedule Visit Modal Popup */}
      <ScheduleVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        propertyTitle={property.title}
        propertyLocation={property.location}
      />

      {/* Direct Enquiry Modal Popup */}
      <EnquireModal
        isOpen={isEnquireModalOpen}
        onClose={() => setIsEnquireModalOpen(false)}
        property={property}
      />

      <Footer />
    </div>
  );
}

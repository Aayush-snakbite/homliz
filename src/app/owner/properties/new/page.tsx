'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { ownerPropertiesService } from '@/lib/ownerProperties';
import { PropertyType, PropertySubType, FurnishingStatus } from '@/types/property';
import {
  Building,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  PlusCircle,
  Phone,
  User,
  Sofa,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';

const AMENITY_OPTIONS = [
  'Parking',
  'Power Backup',
  'Lift',
  'Wi-Fi',
  'Air Conditioning',
  'CCTV',
  'Water Supply',
  'Modular Kitchen',
  'Gated Society',
  'Balcony View',
  'Private Terrace',
];

function NewPropertyContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('residential');
  const [subType, setSubType] = useState<PropertySubType>('Apartment');
  const [listingType, setListingType] = useState<'Rent' | 'Lease'>('Rent');

  const [location, setLocation] = useState('Civil Lines');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('273001');

  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [areaSqFt, setAreaSqFt] = useState<number>(1200);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi-Furnished');
  const [floor, setFloor] = useState<number>(1);
  const [totalFloors, setTotalFloors] = useState<number>(4);

  const [rent, setRent] = useState<number>(18000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(36000);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Power Backup',
    'Water Supply',
    'Parking',
  ]);
  const [description, setDescription] = useState('');

  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 ');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!title.trim()) {
      setError('Please enter a descriptive property title.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the full address of the property.');
      return;
    }
    if (!rent || rent <= 0) {
      setError('Please enter a valid monthly rent amount in ₹.');
      return;
    }
    if (!areaSqFt || areaSqFt <= 0) {
      setError('Please enter a valid property area in sq ft.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a property description.');
      return;
    }

    setIsLoading(true);
    try {
      if (!user?.id) throw new Error('User session not found.');

      ownerPropertiesService.addOwnerProperty(
        {
          title: title.trim(),
          type,
          subType,
          listingType,
          location,
          address: address.trim(),
          pincode: pincode.trim(),
          bedrooms: type === 'residential' ? bedrooms : undefined,
          bathrooms,
          areaSqFt,
          furnishing,
          floor,
          totalFloors,
          rent,
          securityDeposit: securityDeposit || rent * 2,
          amenities: selectedAmenities,
          description: description.trim(),
          ownerType: 'Direct Owner',
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
          status: 'Pending Review',
          image:
            type === 'residential'
              ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
        },
        user.id
      );

      // Redirect to owner dashboard
      router.push('/owner/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to submit property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Action Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <Link
                href="/owner/dashboard"
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1 mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Add New Property Listing
              </h1>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Gorakhpur Listing Form
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Listing Multi-section Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Info */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>1. Basic Property Information</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 BHK Luxury Apartment in Civil Lines"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Property Category *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Property Type *
                  </label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value as PropertySubType)}
                    className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {type === 'residential' ? (
                      <>
                        <option value="Apartment">Apartment / Flat</option>
                        <option value="Independent House">Independent House</option>
                        <option value="Villa">Villa</option>
                        <option value="Builder Floor">Builder Floor</option>
                        <option value="PG / Room">PG / Room</option>
                      </>
                    ) : (
                      <>
                        <option value="Commercial Shop">Commercial Shop</option>
                        <option value="Office Space">Office Space</option>
                        <option value="Showroom">Showroom</option>
                        <option value="Commercial Floor">Commercial Floor</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Commercial Building">Commercial Building</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Listing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as 'Rent' | 'Lease')}
                    className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Rent">Rent (Monthly)</option>
                    <option value="Lease">Lease (Long term)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Location */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>2. Location & Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gorakhpur Locality / Area *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Civil Lines">Civil Lines</option>
                    <option value="Golghar">Golghar</option>
                    <option value="Raptinagar">Raptinagar</option>
                    <option value="Medical Road">Medical Road</option>
                    <option value="Basharatpur">Basharatpur</option>
                    <option value="Mohaddipur">Mohaddipur</option>
                    <option value="Taramandal">Taramandal</option>
                    <option value="Betiahata">Betiahata</option>
                    <option value="Other">Other Gorakhpur Area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Property Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat No. 402, Park View Heights, Near Park Road, Civil Lines, Gorakhpur"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 3: Property Specs */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                <span>3. Specs & Layout</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {type === 'residential' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bedrooms (BHK)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Carpet Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Furnishing Status
                  </label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                    className="w-full bg-[#080C14] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Floor No.
                  </label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Pricing */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                <span>4. Pricing & Deposit</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="e.g. 18000"
                    value={rent}
                    onChange={(e) => {
                      const r = Number(e.target.value);
                      setRent(r);
                      setSecurityDeposit(r * 2);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 36000"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Amenities */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5. Amenities & Features</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITY_OPTIONS.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span>{amenity}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Description & Contact */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <User className="w-4 h-4 text-emerald-400" />
                <span>6. Description & Contact</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Property Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your property, nearby landmarks, security, water supply, and tenant preferences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone (+91 Gorakhpur)
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Link
                href="/owner/dashboard"
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Listing...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Property for Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NewPropertyPage() {
  return (
    <ProtectedRoute allowedRoles={['property_owner']}>
      <NewPropertyContent />
    </ProtectedRoute>
  );
}

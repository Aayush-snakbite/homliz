'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { ownerPropertiesService } from '@/lib/ownerProperties';
import { PropertyType, PropertySubType, FurnishingStatus, OwnerPropertyStatus } from '@/types/property';
import {
  Building,
  MapPin,
  IndianRupee,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Save,
  User,
} from 'lucide-react';

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

interface EditPropertyContentProps {
  id: string;
}

function EditPropertyContent({ id }: EditPropertyContentProps) {
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
  const [status, setStatus] = useState<OwnerPropertyStatus>('Pending Review');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (user?.id && id) {
      const prop = ownerPropertiesService.getOwnerPropertyById(id, user.id);
      if (prop) {
        setTitle(prop.title);
        setType(prop.type);
        setSubType(prop.subType);
        setListingType(prop.listingType || 'Rent');
        setLocation(prop.location);
        setAddress(prop.address);
        setPincode(prop.pincode || '273001');
        setBedrooms(prop.bedrooms || 2);
        setBathrooms(prop.bathrooms || 2);
        setAreaSqFt(prop.areaSqFt);
        setFurnishing(prop.furnishing || 'Semi-Furnished');
        setFloor(prop.floor || 1);
        setTotalFloors(prop.totalFloors || 4);
        setRent(prop.rent);
        setSecurityDeposit(prop.securityDeposit || prop.rent * 2);
        setStatus((prop.status || 'Published') as OwnerPropertyStatus);
        setSelectedAmenities(prop.amenities || []);
        setDescription(prop.description || '');
        setContactName(prop.contactName || user.name);
        setContactPhone(prop.contactPhone || user.phone);
      } else {
        setError('Property listing not found or you do not have permission to edit it.');
      }
      setIsInitializing(false);
    }
  }, [id, user]);

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

    if (!title.trim()) {
      setError('Please enter a property title.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the full property address.');
      return;
    }

    setIsLoading(true);
    try {
      if (!user?.id) throw new Error('User session not found.');

      const updated = ownerPropertiesService.updateOwnerProperty(
        id,
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
          securityDeposit,
          status: 'Pending Review',
          amenities: selectedAmenities,
          description: description.trim(),
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
        },
        user.id
      );

      if (!updated) {
        throw new Error('Failed to update listing. Permission denied.');
      }

      router.push('/owner/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update property.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center text-slate-100">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading Property Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Edit Property Listing
              </h1>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Listing ID: {id}
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Status Control */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">Listing Status</span>
                <span className="text-xs text-slate-400">Current status of your property on HOMLIZ</span>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OwnerPropertyStatus)}
                className="bg-[#080C14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer font-bold"
              >
                <option value="Draft">Draft</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Basic Info */}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Property Category
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
                    Property Type
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
                    Listing Type
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

            {/* Location */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>2. Location & Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gorakhpur Locality / Area
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Specs & Pricing */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                <span>3. Specs & Pricing</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {type === 'residential' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Carpet Area (sq ft)</label>
                  <input
                    type="number"
                    required
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <User className="w-4 h-4 text-emerald-400" />
                <span>4. Description</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit & Cancel */}
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
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Property Changes</span>
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

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={['property_owner']}>
      <EditPropertyContent id={id} />
    </ProtectedRoute>
  );
}

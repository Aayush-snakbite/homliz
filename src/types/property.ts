export type PropertyType = 'residential' | 'commercial';

export type PropertySubType = 
  | 'Apartment' 
  | 'Independent House' 
  | 'Villa' 
  | 'Builder Floor'
  | 'PG / Room'
  | 'Commercial Shop' 
  | 'Office Space' 
  | 'Showroom'
  | 'Commercial Floor'
  | 'Warehouse'
  | 'Commercial Building';

export type FurnishingStatus = 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  subType: PropertySubType;
  rent: number;
  securityDeposit?: number; // Deposit amount in INR
  location: string; // Locality name e.g., "Civil Lines"
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt: number;
  furnishing?: FurnishingStatus;
  image: string;
  gallery?: string[]; // Array of high-res image URLs for details page
  isFeatured?: boolean;
  isDemo?: boolean;
  description: string;
  amenities: string[];
  ownerType: 'Direct Owner' | 'Local Representative';
  availableFrom?: string;
  createdAt?: string; // Date string for sorting
}

export interface GorakhpurArea {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'mixed';
  tagline: string;
  description: string;
  image: string;
  propertyCount: number;
}

export interface FilterState {
  searchQuery: string;
  searchLocation: string; // Locality or 'all'
  propertyType: 'all' | 'residential' | 'commercial';
  subType: string; // Specific subType or 'all'
  minRent: number;
  maxRent: number;
  maxBudget?: number;
  bedrooms: number; // 0 = any, 1, 2, 3, 4+
  furnishing: string; // 'all' or FurnishingStatus
  sortBy: 'newest' | 'rent-asc' | 'rent-desc';
}

import { Property } from './property';

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

export type EnquiryStatus = 'Pending' | 'Contacted' | 'Closed';

export interface PropertyEnquiry {
  id: string;
  userId: string; // Tenant ID
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyRent: number;
  propertyType: string;
  propertyImage?: string;
  tenantName: string;
  phone: string;
  email?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

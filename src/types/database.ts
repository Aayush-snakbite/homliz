export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'tenant' | 'property_owner' | 'admin';
export type PropertyType = 'residential' | 'commercial';
export type ListingType = 'Rent' | 'Lease';
export type PropertyStatus = 'pending' | 'approved' | 'rejected';
export type EnquiryStatus = 'pending' | 'contacted' | 'closed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          property_type: PropertyType;
          sub_type: string;
          listing_type: ListingType;
          locality: string;
          address: string;
          pincode: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          area_sqft: number;
          furnishing: string | null;
          floor: number | null;
          total_floors: number | null;
          rent: number;
          security_deposit: number | null;
          image: string;
          is_featured: boolean;
          is_demo: boolean;
          description: string;
          amenities: Json;
          owner_type: string;
          owner_name: string | null;
          owner_phone: string | null;
          status: PropertyStatus;
          rejection_reason: string | null;
          available_from: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          property_type?: PropertyType;
          sub_type?: string;
          listing_type?: ListingType;
          locality: string;
          address: string;
          pincode?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          area_sqft: number;
          furnishing?: string | null;
          floor?: number | null;
          total_floors?: number | null;
          rent: number;
          security_deposit?: number | null;
          image: string;
          is_featured?: boolean;
          is_demo?: boolean;
          description?: string;
          amenities?: Json;
          owner_type?: string;
          owner_name?: string | null;
          owner_phone?: string | null;
          status?: PropertyStatus;
          rejection_reason?: string | null;
          available_from?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          property_type?: PropertyType;
          sub_type?: string;
          listing_type?: ListingType;
          locality?: string;
          address?: string;
          pincode?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          area_sqft?: number;
          furnishing?: string | null;
          floor?: number | null;
          total_floors?: number | null;
          rent?: number;
          security_deposit?: number | null;
          image?: string;
          is_featured?: boolean;
          is_demo?: boolean;
          description?: string;
          amenities?: Json;
          owner_type?: string;
          owner_name?: string | null;
          owner_phone?: string | null;
          status?: PropertyStatus;
          rejection_reason?: string | null;
          available_from?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          image_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          image_url?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          created_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          property_id: string;
          tenant_id: string;
          tenant_name: string;
          phone: string;
          email: string | null;
          message: string;
          status: EnquiryStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          tenant_id: string;
          tenant_name: string;
          phone: string;
          email?: string | null;
          message: string;
          status?: EnquiryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          tenant_id?: string;
          tenant_name?: string;
          phone?: string;
          email?: string | null;
          message?: string;
          status?: EnquiryStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      property_type: PropertyType;
      listing_type: ListingType;
      property_status: PropertyStatus;
      enquiry_status: EnquiryStatus;
    };
  };
}

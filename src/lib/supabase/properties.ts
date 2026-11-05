import { supabase, isSupabaseConfigured } from './client';
import { Database } from '@/types/database';
import {
  Property,
  PropertyType,
  PropertySubType,
  FurnishingStatus,
  OwnerPropertyStatus,
} from '@/types/property';

export type DbProperty = Database['public']['Tables']['properties']['Row'];
export type DbPropertyImage = Database['public']['Tables']['property_images']['Row'];

/**
 * Maps a PostgreSQL public.properties record and property_images array to the application Property model.
 * Adheres strictly to the existing database schema and application Property type without inventing fields.
 */
export function mapDatabasePropertyToAppProperty(
  dbProp: DbProperty,
  dbImages?: DbPropertyImage[]
): Property {
  const galleryUrls =
    dbImages && dbImages.length > 0
      ? [...dbImages]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => img.image_url)
      : [dbProp.image];

  let parsedAmenities: string[] = [];
  if (Array.isArray(dbProp.amenities)) {
    parsedAmenities = dbProp.amenities.map(String);
  } else if (typeof dbProp.amenities === 'string') {
    try {
      parsedAmenities = JSON.parse(dbProp.amenities);
    } catch {
      parsedAmenities = [dbProp.amenities];
    }
  }

  return {
    id: dbProp.id,
    title: dbProp.title,
    type: dbProp.property_type as PropertyType,
    subType: dbProp.sub_type as PropertySubType,
    rent: Number(dbProp.rent),
    securityDeposit: dbProp.security_deposit !== null ? Number(dbProp.security_deposit) : undefined,
    location: dbProp.locality,
    address: dbProp.address,
    pincode: dbProp.pincode ?? undefined,
    bedrooms: dbProp.bedrooms ?? undefined,
    bathrooms: dbProp.bathrooms ?? undefined,
    areaSqFt: dbProp.area_sqft,
    furnishing: (dbProp.furnishing as FurnishingStatus) || undefined,
    floor: dbProp.floor ?? undefined,
    totalFloors: dbProp.total_floors ?? undefined,
    listingType: dbProp.listing_type as 'Rent' | 'Lease',
    image: dbProp.image,
    gallery: galleryUrls.length > 0 ? galleryUrls : [dbProp.image],
    isFeatured: Boolean(dbProp.is_featured),
    isDemo: Boolean(dbProp.is_demo),
    description: dbProp.description,
    amenities: parsedAmenities,
    ownerType: (dbProp.owner_type as 'Direct Owner' | 'Local Representative') || 'Direct Owner',
    ownerId: dbProp.owner_id,
    status: dbProp.status as OwnerPropertyStatus,
    rejectionReason: dbProp.rejection_reason ?? undefined,
    contactName: dbProp.owner_name ?? undefined,
    contactPhone: dbProp.owner_phone ?? undefined,
    availableFrom: dbProp.available_from ?? undefined,
    createdAt: dbProp.created_at ? dbProp.created_at.split('T')[0] : undefined,
  };
}

/**
 * Fetch all approved properties from Supabase PostgreSQL public.properties.
 * PUBLIC SECURITY: Strictly enforces status = 'approved'.
 */
export async function getApprovedProperties(): Promise<{
  properties: Property[];
  error: Error | null;
}> {
  try {
    if (!isSupabaseConfigured()) {
      return { properties: [], error: null };
    }

    const { data: dbProps, error: propError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (propError) {
      return { properties: [], error: new Error(propError.message) };
    }

    if (!dbProps || dbProps.length === 0) {
      return { properties: [], error: null };
    }

    const propIds = dbProps.map((p) => p.id);
    const { data: dbImages } = await supabase
      .from('property_images')
      .select('*')
      .in('property_id', propIds);

    const imagesByPropId = new Map<string, DbPropertyImage[]>();
    if (dbImages) {
      for (const img of dbImages) {
        const list = imagesByPropId.get(img.property_id) || [];
        list.push(img);
        imagesByPropId.set(img.property_id, list);
      }
    }

    const appProperties = dbProps.map((dbProp) =>
      mapDatabasePropertyToAppProperty(dbProp, imagesByPropId.get(dbProp.id))
    );

    return { properties: appProperties, error: null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { properties: [], error: errorObj };
  }
}

/**
 * Fetch a single approved property by ID from Supabase PostgreSQL public.properties.
 * PUBLIC SECURITY: Strictly enforces status = 'approved'.
 */
export async function getApprovedPropertyById(
  id: string
): Promise<{ property: Property | null; error: Error | null }> {
  try {
    if (!isSupabaseConfigured()) {
      return { property: null, error: null };
    }

    const { data: dbProp, error: propError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .maybeSingle();

    if (propError) {
      return { property: null, error: new Error(propError.message) };
    }

    if (!dbProp) {
      return { property: null, error: null };
    }

    const { data: dbImages } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', dbProp.id)
      .order('sort_order', { ascending: true });

    const appProp = mapDatabasePropertyToAppProperty(dbProp, dbImages || []);
    return { property: appProp, error: null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { property: null, error: errorObj };
  }
}

// Aliases for backwards compatibility
export const getApprovedPropertiesFromSupabase = getApprovedProperties;
export const getApprovedPropertyByIdFromSupabase = getApprovedPropertyById;

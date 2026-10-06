import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './client';
import { Database, UserRole } from '@/types/database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Supabase Profiles & Roles Helper Layer (Phase 4 Step 2C)
 * Interacts with PostgreSQL public.profiles table.
 */

/**
 * Fetch a user profile from PostgreSQL public.profiles by user ID (auth.users.id).
 */
export async function getUserProfile(
  userId: string
): Promise<{ profile: Profile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { profile: null, error: new Error(error.message) };
    }

    return { profile: data, error: null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { profile: null, error: errorObj };
  }
}

/**
 * Ensure a profile exists in public.profiles for an authenticated Supabase user.
 * If missing, inserts a new profile row using the user's UUID as primary key.
 * 
 * SECURITY RULES:
 * - Profile ID MUST equal auth.users.id.
 * - Default role on creation is strictly 'tenant' (enforced by RLS & application logic).
 * - Admin self-registration or escalation is IMPOSSIBLE.
 */
export async function ensureUserProfile(
  sbUser: SupabaseUser
): Promise<{ profile: Profile | null; error: Error | null }> {
  try {
    // 1. Check if profile already exists
    const existing = await getUserProfile(sbUser.id);
    if (existing.error) {
      // Non-fatal error fallback, proceed to attempt create if missing
    }
    if (existing.profile) {
      return { profile: existing.profile, error: null };
    }

    // 2. Prepare safe new profile payload
    const fullName =
      (sbUser.user_metadata?.name as string) ||
      (sbUser.user_metadata?.full_name as string) ||
      sbUser.email?.split('@')[0] ||
      'HOMLIZ User';

    const phone = (sbUser.user_metadata?.phone as string) || '';

    // Authoritative default role on client-side creation is 'tenant'
    const role: UserRole = 'tenant';

    const newProfilePayload: ProfileInsert = {
      id: sbUser.id, // Primary key MUST equal auth.users.id
      full_name: fullName.trim(),
      email: sbUser.email || '',
      phone: phone.trim(),
      role, // Strictly tenant
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfilePayload)
      .select('*')
      .single();

    if (error) {
      // If concurrent insertion occurred, try reading again
      const retry = await getUserProfile(sbUser.id);
      if (retry.profile) {
        return { profile: retry.profile, error: null };
      }
      return { profile: null, error: new Error(error.message) };
    }

    return { profile: data, error: null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { profile: null, error: errorObj };
  }
}

/**
 * Update user's non-role profile information (full_name, phone, avatar_url).
 * Role modifications cannot be performed via client updates.
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'phone' | 'avatar_url'>>
): Promise<{ profile: Profile | null; error: Error | null }> {
  try {
    const updatePayload: ProfileUpdate = {
      full_name: updates.full_name?.trim(),
      phone: updates.phone?.trim(),
      avatar_url: updates.avatar_url,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      return { profile: null, error: new Error(error.message) };
    }

    return { profile: data, error: null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { profile: null, error: errorObj };
  }
}

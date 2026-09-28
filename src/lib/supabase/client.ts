import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Reusable Supabase browser client foundation.
 * Uses environment variables NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Falls back safely to placeholder values when credentials are not yet configured.
 */
export const supabase: SupabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export const createClient = (): SupabaseClient => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== 'https://placeholder.supabase.co' && !url.includes('placeholder'));
};

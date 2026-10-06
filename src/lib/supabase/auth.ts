import { Session, User as SupabaseUser, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from './client';

/**
 * Supabase Auth Helper Foundation
 * Minimal reusable authentication helper functions for Supabase Auth.
 */

/**
 * Retrieve the current active Supabase Auth session.
 */
export async function getSupabaseSession(): Promise<{ session: Session | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error: error ? new Error(error.message) : null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { session: null, error: errorObj };
  }
}

/**
 * Retrieve the current authenticated Supabase User.
 */
export async function getSupabaseUser(): Promise<{ user: SupabaseUser | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error: error ? new Error(error.message) : null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { user: null, error: errorObj };
  }
}

/**
 * Sign in using email and password with Supabase Auth.
 */
export async function supabaseSignInWithPassword(
  email: string,
  password: string
): Promise<{ user: SupabaseUser | null; session: Session | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return {
      user: data.user,
      session: data.session,
      error: error ? new Error(error.message) : null,
    };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { user: null, session: null, error: errorObj };
  }
}

/**
 * Sign up a new user using email and password with Supabase Auth.
 */
export async function supabaseSignUp(
  email: string,
  password: string,
  options?: { data?: Record<string, unknown> }
): Promise<{ user: SupabaseUser | null; session: Session | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    return {
      user: data.user,
      session: data.session,
      error: error ? new Error(error.message) : null,
    };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { user: null, session: null, error: errorObj };
  }
}

/**
 * Sign out from Supabase Auth.
 */
export async function supabaseSignOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? new Error(error.message) : null };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return { error: errorObj };
  }
}

/**
 * Subscribe to Supabase auth state change events.
 * Returns a cleanup function to unsubscribe and prevent listener/memory leaks.
 */
export function onSupabaseAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): { unsubscribe: () => void } {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);

  return {
    unsubscribe: () => {
      subscription.unsubscribe();
    },
  };
}

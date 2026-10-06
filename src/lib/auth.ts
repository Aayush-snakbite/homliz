import { User, UserRole, LoginCredentials, SignupCredentials } from '@/types/auth';
import {
  getSupabaseSession,
  supabaseSignInWithPassword,
  supabaseSignUp,
  supabaseSignOut,
  ensureUserProfile,
  updateUserProfile,
} from './supabase';
import { isSupabaseConfigured } from './supabase/client';

const STORAGE_KEY = 'homliz_auth_session_v1';
const USERS_STORAGE_KEY = 'homliz_registered_users_v1';

// Initial demo accounts for quick testing
export const DEMO_ACCOUNTS: Record<UserRole, User> = {
  tenant: {
    id: 'user-tenant-101',
    name: 'Rahul Srivastava',
    email: 'tenant@homliz.com',
    phone: '+91 98765 11111',
    role: 'tenant',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    createdAt: '2026-08-01',
  },
  property_owner: {
    id: 'user-owner-202',
    name: 'Vikram Pratap Singh',
    email: 'owner@homliz.com',
    phone: '+91 98765 22222',
    role: 'property_owner',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    createdAt: '2026-08-05',
  },
  admin: {
    id: 'user-admin-303',
    name: 'Gorakhpur HOMLIZ Admin',
    email: 'admin@homliz.com',
    phone: '+91 98765 33333',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    createdAt: '2026-08-01',
  },
};

export interface SignupResponse {
  user: User | null;
  requiresEmailConfirmation: boolean;
  message?: string;
}

/**
 * Authentication & Profile service layer integrated with Supabase Auth & public.profiles.
 */
export const authService = {
  // Get active session from localStorage (local UI compatibility state bridge)
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Save active session
  setStoredUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  // Resolve current active Supabase Auth user & PostgreSQL Profile
  async getCurrentSessionUser(): Promise<User | null> {
    try {
      const { session } = await getSupabaseSession();
      if (session?.user) {
        const { profile } = await ensureUserProfile(session.user);
        const authoritativeRole: UserRole = profile?.role || 'tenant';
        const appUser: User = {
          id: session.user.id, // Primary key MUST equal auth.users.id
          name: profile?.full_name || (session.user.user_metadata?.name as string) || session.user.email?.split('@')[0] || 'HOMLIZ User',
          email: profile?.email || session.user.email || '',
          phone: profile?.phone || (session.user.user_metadata?.phone as string) || '',
          role: authoritativeRole, // Authoritative role from database
          avatarUrl: profile?.avatar_url || undefined,
          createdAt: profile?.created_at ? profile.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        };
        this.setStoredUser(appUser);
        return appUser;
      }
    } catch {
      // Fall through to stored user check
    }

    // Fallback for placeholder demo accounts when Supabase is in placeholder mode
    return this.getStoredUser();
  },

  // Login with Supabase Auth & PostgreSQL Profiles Table Synchronization
  async login(credentials: LoginCredentials): Promise<User> {
    const query = credentials.emailOrPhone.toLowerCase().trim();
    const isEmail = query.includes('@');

    // Attempt real Supabase Auth
    if (isEmail && credentials.password) {
      const sbRes = await supabaseSignInWithPassword(query, credentials.password);

      if (sbRes.error) {
        // Fallback for demo accounts if Supabase credentials are placeholder
        if (!isSupabaseConfigured() && (query === 'tenant@homliz.com' || query === 'owner@homliz.com' || query === 'admin@homliz.com')) {
          return this.loginDemoAccount(query, credentials.role);
        }

        let errorMsg = sbRes.error.message;
        if (errorMsg.includes('Invalid login credentials')) {
          errorMsg = 'Invalid email or password. Please check your credentials.';
        } else if (errorMsg.includes('Email not confirmed')) {
          errorMsg = 'Email confirmation required. Please check your inbox.';
        }
        throw new Error(errorMsg);
      }

      if (sbRes.user) {
        // Ensure profile exists in public.profiles table using auth.users.id
        const { profile } = await ensureUserProfile(sbRes.user);

        // Authoritative role comes directly from PostgreSQL public.profiles
        const authoritativeRole: UserRole = profile?.role || 'tenant';

        const appUser: User = {
          id: sbRes.user.id, // Primary key MUST equal auth.users.id
          name: profile?.full_name || (sbRes.user.user_metadata?.name as string) || query.split('@')[0],
          email: profile?.email || sbRes.user.email || query,
          phone: profile?.phone || (sbRes.user.user_metadata?.phone as string) || '',
          role: authoritativeRole, // Authoritative role from database
          avatarUrl: profile?.avatar_url || undefined,
          createdAt: profile?.created_at ? profile.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        };

        this.setStoredUser(appUser);
        return appUser;
      }
    }

    // Demo account / fallback check if phone or no password provided
    if (!isSupabaseConfigured() || query === 'tenant' || query === 'owner' || query === 'admin') {
      return this.loginDemoAccount(query, credentials.role);
    }

    throw new Error('Invalid email or password. Please enter valid credentials.');
  },

  // Helper for demo login fallback when Supabase is in placeholder mode
  async loginDemoAccount(query: string, requestedRole?: UserRole): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (query.includes('tenant')) {
      const u = DEMO_ACCOUNTS.tenant;
      this.setStoredUser(u);
      return u;
    }
    if (query.includes('owner')) {
      const u = DEMO_ACCOUNTS.property_owner;
      this.setStoredUser(u);
      return u;
    }
    if (query.includes('admin')) {
      const u = DEMO_ACCOUNTS.admin;
      this.setStoredUser(u);
      return u;
    }

    const role: UserRole = requestedRole === 'admin' ? 'admin' : requestedRole === 'property_owner' ? 'property_owner' : 'tenant';
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: query.includes('@') ? query.split('@')[0] : 'Gorakhpur User',
      email: query.includes('@') ? query : `${query}@homliz.com`,
      phone: query.includes('@') ? '+91 98765 43210' : query,
      role,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.setStoredUser(newUser);
    return newUser;
  },

  // Signup with Supabase Auth & PostgreSQL Profile Creation
  async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    // Strictly prevent admin self-registration
    const sanitizedRole: UserRole = credentials.role === 'admin' ? 'tenant' : credentials.role;

    if (credentials.email && credentials.password) {
      const sbRes = await supabaseSignUp(credentials.email, credentials.password, {
        data: {
          name: credentials.name,
          phone: credentials.phone,
          requested_role: sanitizedRole,
        },
      });

      if (sbRes.error) {
        if (!isSupabaseConfigured()) {
          return this.signupDemoFallback(credentials, sanitizedRole);
        }

        let errorMsg = sbRes.error.message;
        if (errorMsg.includes('User already registered') || errorMsg.includes('already exists')) {
          errorMsg = 'This email address is already registered. Please log in instead.';
        } else if (errorMsg.includes('Password should be at least')) {
          errorMsg = 'Password must be at least 6 characters long.';
        }
        throw new Error(errorMsg);
      }

      // If user created but no active session -> email confirmation required
      if (sbRes.user && !sbRes.session) {
        return {
          user: null,
          requiresEmailConfirmation: true,
          message: 'Account created. Please check your email to confirm your account.',
        };
      }

      if (sbRes.user && sbRes.session) {
        // Ensure profile row created in public.profiles with role = 'tenant'
        const { profile } = await ensureUserProfile(sbRes.user);
        const authoritativeRole: UserRole = profile?.role || 'tenant';

        const appUser: User = {
          id: sbRes.user.id,
          name: profile?.full_name || credentials.name.trim(),
          email: profile?.email || credentials.email.trim(),
          phone: profile?.phone || credentials.phone.trim(),
          role: authoritativeRole,
          createdAt: new Date().toISOString().split('T')[0],
        };

        this.setStoredUser(appUser);
        return {
          user: appUser,
          requiresEmailConfirmation: false,
        };
      }
    }

    return this.signupDemoFallback(credentials, sanitizedRole);
  },

  // Signup demo fallback when Supabase credentials are placeholder
  async signupDemoFallback(credentials: SignupCredentials, assignedRole: UserRole): Promise<SignupResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: credentials.name.trim(),
      email: credentials.email.trim(),
      phone: credentials.phone.trim(),
      role: assignedRole,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (typeof window !== 'undefined') {
      const registered = localStorage.getItem(USERS_STORAGE_KEY);
      const list: User[] = registered ? JSON.parse(registered) : [];
      list.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    }

    this.setStoredUser(newUser);
    return {
      user: newUser,
      requiresEmailConfirmation: false,
    };
  },

  // Update user profile info in local storage and PostgreSQL public.profiles
  updateProfile(updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatarUrl'>>): User | null {
    const currentUser = this.getStoredUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      ...updates,
    };

    this.setStoredUser(updatedUser);

    // Synchronize updates to PostgreSQL public.profiles asynchronously if user has a valid UUID
    if (currentUser.id && currentUser.id.length > 20) {
      updateUserProfile(currentUser.id, {
        full_name: updates.name,
        phone: updates.phone,
        avatar_url: updates.avatarUrl,
      }).catch(() => {
        // Non-blocking background sync
      });
    }

    if (typeof window !== 'undefined') {
      const registered = localStorage.getItem(USERS_STORAGE_KEY);
      if (registered) {
        const users: User[] = JSON.parse(registered);
        const idx = users.findIndex((u) => u.id === currentUser.id);
        if (idx !== -1) {
          users[idx] = updatedUser;
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }
    }

    return updatedUser;
  },

  // Logout with Supabase Auth
  async logout(): Promise<void> {
    await supabaseSignOut();
    this.setStoredUser(null);
  },
};

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LoginCredentials, SignupCredentials, AuthState } from '@/types/auth';
import { authService, SignupResponse } from '@/lib/auth';
import { onSupabaseAuthStateChange } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (credentials: SignupCredentials) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  updateRole: (newRole: UserRole) => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatarUrl'>>) => void;
  isTenant: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize Real Supabase Auth session & listen for session lifecycle events
  useEffect(() => {
    let mounted = true;

    // 1. Initial session restoration from Supabase Auth & public.profiles
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentSessionUser();
        if (mounted) {
          setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          });
        }
      } catch {
        if (mounted) {
          const user = authService.getStoredUser();
          setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          });
        }
      }
    };

    initAuth();

    // 2. Subscribe to Supabase auth state change events
    const { unsubscribe } = onSupabaseAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        authService.setStoredUser(null);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const user = await authService.getCurrentSessionUser();
        if (mounted) {
          setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          });
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.login(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setState((prev) => ({ ...prev, isLoading: false, error: msg }));
      throw err;
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<SignupResponse> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await authService.signup(credentials);
      if (res.requiresEmailConfirmation || !res.user) {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }));
      } else {
        setState({
          user: res.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setState((prev) => ({ ...prev, isLoading: false, error: msg }));
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const updateRole = (newRole: UserRole) => {
    if (!state.user) return;
    const updated: User = { ...state.user, role: newRole };
    authService.setStoredUser(updated);
    setState((prev) => ({ ...prev, user: updated }));
  };

  const updateProfile = (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatarUrl'>>) => {
    const updated = authService.updateProfile(updates);
    if (updated) {
      setState((prev) => ({ ...prev, user: updated }));
    }
  };

  const isTenant = state.user?.role === 'tenant';
  const isOwner = state.user?.role === 'property_owner';
  const isAdmin = state.user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateRole,
        updateProfile,
        isTenant,
        isOwner,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

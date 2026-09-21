'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LoginCredentials, SignupCredentials, AuthState } from '@/types/auth';
import { authService } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (credentials: SignupCredentials) => Promise<User>;
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

  // Restore stored session on mount
  useEffect(() => {
    const user = authService.getStoredUser();
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    });
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
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check credentials.';
      setState((prev) => ({ ...prev, isLoading: false, error: msg }));
      throw err;
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<User> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.signup(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
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

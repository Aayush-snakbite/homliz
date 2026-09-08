export type UserRole = 'tenant' | 'property_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password?: string;
  role?: UserRole;
}

export interface SignupCredentials {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

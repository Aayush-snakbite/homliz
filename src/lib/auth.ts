import { User, UserRole, LoginCredentials, SignupCredentials } from '@/types/auth';

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

/**
 * Mock authentication service layer.
 * Designed to be easily replaced by Supabase / NextAuth / Firebase without modifying UI.
 */
export const authService = {
  // Get active session from localStorage
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

  // Mock login with network delay simulation
  async login(credentials: LoginCredentials): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const query = credentials.emailOrPhone.toLowerCase().trim();

    // Check demo accounts
    if (query === 'tenant@homliz.com' || query === 'tenant') {
      const u = DEMO_ACCOUNTS.tenant;
      this.setStoredUser(u);
      return u;
    }
    if (query === 'owner@homliz.com' || query === 'owner') {
      const u = DEMO_ACCOUNTS.property_owner;
      this.setStoredUser(u);
      return u;
    }
    if (query === 'admin@homliz.com' || query === 'admin') {
      const u = DEMO_ACCOUNTS.admin;
      this.setStoredUser(u);
      return u;
    }

    // Check custom registered users from localStorage
    if (typeof window !== 'undefined') {
      const registered = localStorage.getItem(USERS_STORAGE_KEY);
      if (registered) {
        const users: User[] = JSON.parse(registered);
        const match = users.find(
          (u) => u.email.toLowerCase() === query || u.phone.replaceAll(' ', '') === query.replaceAll(' ', '')
        );
        if (match) {
          this.setStoredUser(match);
          return match;
        }
      }
    }

    // Fallback: create dynamic user for any email/phone entered
    const isOwner = credentials.role === 'property_owner';
    const isAdmin = credentials.role === 'admin';
    const role: UserRole = isAdmin ? 'admin' : isOwner ? 'property_owner' : 'tenant';

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

  // Mock signup
  async signup(credentials: SignupCredentials): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: credentials.name.trim(),
      email: credentials.email.trim(),
      phone: credentials.phone.trim(),
      role: credentials.role,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Store in registered users array
    if (typeof window !== 'undefined') {
      const registered = localStorage.getItem(USERS_STORAGE_KEY);
      const list: User[] = registered ? JSON.parse(registered) : [];
      list.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    }

    this.setStoredUser(newUser);
    return newUser;
  },

  // Logout
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.setStoredUser(null);
  },
};

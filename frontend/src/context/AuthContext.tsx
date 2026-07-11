import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'fan' | 'volunteer' | 'organizer' | 'staff';
  language: string;
  preferences?: {
    accessibilityMode: boolean;
    favoriteTeam: string;
    dietaryRestrictions: string[];
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: (role: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (prefs: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user profiles for offline fallback (NO passwords stored here)
const DEMO_USERS: Record<string, Omit<User, 'id'> & { id: string }> = {
  organizer: { id: 'u-1', name: 'Sarah Connor',    email: 'admin@arenamind.com',     role: 'organizer', language: 'en' },
  volunteer: { id: 'u-2', name: 'David Beckham',   email: 'volunteer@arenamind.com', role: 'volunteer', language: 'es' },
  fan:       { id: 'u-3', name: 'John Doe',         email: 'fan@arenamind.com',       role: 'fan',       language: 'en' },
  staff:     { id: 'u-4', name: 'Marcus Rashford', email: 'staff@arenamind.com',     role: 'staff',     language: 'en' },
};

const setAuthStorage = (token: string, user: User) => {
  localStorage.setItem('arenamind_token', token);
  localStorage.setItem('arenamind_user', JSON.stringify(user));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('arenamind_token');
    const storedUser = localStorage.getItem('arenamind_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Standard login with email + password
  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Invalid credentials');
    }

    const data = await response.json();
    setAuthStorage(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    return true;
  };

  // Secure demo login — sends only a role name, no password ever transmitted
  const demoLogin = async (role: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthStorage(data.token, data.user);
        setToken(data.token);
        setUser(data.user);
        return true;
      }
    } catch {
      // Network unreachable — use offline demo profile (no passwords)
    }

    // Offline fallback: use pre-defined demo user profiles (no passwords)
    const demoUser = DEMO_USERS[role];
    if (!demoUser) throw new Error('Invalid demo role');

    const offlineToken = `demo_${role}_${Date.now()}`;
    setAuthStorage(offlineToken, demoUser);
    setToken(offlineToken);
    setUser(demoUser);
    return true;
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Registration failed');
      }

      const data = await response.json();
      setAuthStorage(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      // Offline sandbox fallback
      console.warn('Network registration failed — using local sandbox.');
      const mockUser: User = {
        id: `u-${Date.now()}`,
        name,
        email,
        role: (role as any) || 'fan',
        language: 'en',
      };
      const offlineToken = `sandbox_${Date.now()}`;
      setAuthStorage(offlineToken, mockUser);
      setToken(offlineToken);
      setUser(mockUser);
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('arenamind_token');
    localStorage.removeItem('arenamind_user');
    setToken(null);
    setUser(null);
  };

  const updatePreferences = (prefs: any) => {
    if (!user) return;
    const updatedUser = { ...user, preferences: { ...user.preferences, ...prefs } } as User;
    setUser(updatedUser);
    localStorage.setItem('arenamind_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, demoLogin, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

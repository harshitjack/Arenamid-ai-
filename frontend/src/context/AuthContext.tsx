import React, { createContext, useContext, useState, useEffect } from 'react';

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
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (prefs: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local storage auth
    const storedToken = localStorage.getItem('arenamind_token');
    const storedUser = localStorage.getItem('arenamind_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('arenamind_token', data.token);
      localStorage.setItem('arenamind_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.warn('Network login failed. Triggering sandbox credential checks.');
      // Offline fallback: Check presets
      let mockUser: User | null = null;
      if (email === 'admin@arenamind.com' && password === 'admin123') {
        mockUser = { id: 'u-1', name: 'Sarah Connor', email, role: 'organizer', language: 'en' };
      } else if (email === 'volunteer@arenamind.com' && password === 'volunteer123') {
        mockUser = { id: 'u-2', name: 'David Beckham', email, role: 'volunteer', language: 'es' };
      } else if (email === 'fan@arenamind.com' && password === 'fan123') {
        mockUser = { id: 'u-3', name: 'John Doe', email, role: 'fan', language: 'en', preferences: { accessibilityMode: true, favoriteTeam: 'Canada', dietaryRestrictions: ['halal'] } };
      } else if (email === 'staff@arenamind.com' && password === 'staff123') {
        mockUser = { id: 'u-4', name: 'Marcus Rashford', email, role: 'staff', language: 'en' };
      }

      if (mockUser) {
        const dummyToken = 'sandbox_token_' + Math.random().toString(36).substring(7);
        localStorage.setItem('arenamind_token', dummyToken);
        localStorage.setItem('arenamind_user', JSON.stringify(mockUser));
        setToken(dummyToken);
        setUser(mockUser);
        return true;
      }
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('arenamind_token', data.token);
      localStorage.setItem('arenamind_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.warn('Network registration failed. Enrolling into local sandbox.');
      const mockUser: User = {
        id: 'u-' + Math.floor(Math.random() * 1000),
        name,
        email,
        role: (role as any) || 'fan',
        language: 'en',
      };
      const dummyToken = 'sandbox_token_' + Math.random().toString(36).substring(7);
      localStorage.setItem('arenamind_token', dummyToken);
      localStorage.setItem('arenamind_user', JSON.stringify(mockUser));
      setToken(dummyToken);
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
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...prefs
      }
    } as User;
    setUser(updatedUser);
    localStorage.setItem('arenamind_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updatePreferences }}>
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

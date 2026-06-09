import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe, logout as apiLogout } from '../api/auth.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isTeacher: false,
  isStudent: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const data = await getMe();
        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  // Full-page redirect to Google OAuth
  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }, []);

  // Server-side session destroy + clear local state
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
    }
  }, []);

  const role = user?.role || null;
  const isAuthenticated = !!user;

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: role === 'admin',
    isTeacher: role === 'teacher',
    isStudent: role === 'student',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

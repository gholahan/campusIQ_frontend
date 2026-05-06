import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Role } from '@/shared/types';

const STORAGE_KEY = 'campusiq_role';

interface AuthContextValue {
  role: Role | null;
  login:  (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Role | null) ?? null;
  });

  const login = useCallback((r: Role) => {
    localStorage.setItem(STORAGE_KEY, r);
    setRole(r);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

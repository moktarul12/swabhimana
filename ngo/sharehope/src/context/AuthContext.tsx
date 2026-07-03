import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, User, saveSession, getSession, clearSession } from '../services/database';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const userId = await getSession();
      if (userId) {
        const u = await db.getUserById(userId);
        if (u) setUser(u);
        else await clearSession();
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await db.login(email, password);
    await saveSession(u.id);
    setUser(u);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const u = await db.signUp(name, email, password);
    await saveSession(u.id);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (user) {
      const u = await db.getUserById(user.id);
      if (u) setUser(u);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isSignedIn: !!user, login, signUp, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

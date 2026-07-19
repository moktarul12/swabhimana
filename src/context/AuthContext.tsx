import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { db, User, saveSession, getSession, clearSession } from '../services/database';

const GUEST_KEY = 'manavsathi_guest';

async function getGuestFlag(): Promise<boolean> {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(GUEST_KEY) === '1';
  }
  return false;
}

async function setGuestFlag(value: boolean): Promise<void> {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    if (value) localStorage.setItem(GUEST_KEY, '1');
    else localStorage.removeItem(GUEST_KEY);
  }
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const userId = await getSession();
      if (userId) {
        const u = await db.getUserById(userId);
        if (u) {
          setUser(u);
          await setGuestFlag(false);
          setIsGuest(false);
        } else {
          await clearSession();
          const guest = await getGuestFlag();
          setIsGuest(guest);
        }
      } else {
        const guest = await getGuestFlag();
        setIsGuest(guest);
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await db.login(email, password);
    await saveSession(u.id);
    await setGuestFlag(false);
    setIsGuest(false);
    setUser(u);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const u = await db.signUp(name, email, password);
    await saveSession(u.id);
    await setGuestFlag(false);
    setIsGuest(false);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
    // Stay as guest so they can keep browsing on mobile web
    await setGuestFlag(true);
    setIsGuest(true);
  }, []);

  const continueAsGuest = useCallback(async () => {
    await clearSession();
    setUser(null);
    await setGuestFlag(true);
    setIsGuest(true);
  }, []);

  const refreshUser = useCallback(async () => {
    if (user) {
      const u = await db.getUserById(user.id);
      if (u) setUser(u);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: !!user,
        isGuest,
        login,
        signUp,
        logout,
        continueAsGuest,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

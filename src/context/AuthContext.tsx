"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isValidCredentials, normaliseName } from "@/lib/auth";

type AuthContextValue = {
  user: string | null;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "familyUserName";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) setUser(saved);
  }, []);

  const login = async (name: string, password: string) => {
    const ok = isValidCredentials(name, password);
    if (ok) {
      const n = normaliseName(name);
      setUser(n);
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, n);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
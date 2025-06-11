"use client";

import { createContext, use, type ReactNode } from "react";

import type { ServerUser } from "./server-auth";

// Auth state types
export type User = ServerUser;

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// React 19 hook using use() for context consumption
export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export interface AuthProviderProps {
  children: ReactNode;
  initialUser: ServerUser | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  // Simple logout that redirects
  const logout = () => {
    globalThis.location.href = "/api/auth/logout";
  };

  const contextValue: AuthContextValue = {
    user: initialUser,
    isAuthenticated: !!initialUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Hook for getting user initials for avatar
export function useUserInitials(): string {
  const { user } = useAuth();

  if (!user) {
    return "";
  }

  return user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

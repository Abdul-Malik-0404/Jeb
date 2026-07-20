"use client";

import { createContext, useContext } from "react";

// Provide a default empty state for SSR and components outside the provider
const defaultAuthContext = {
  state: { isAuthenticated: false, isLoading: true },
  getAccessToken: async () => "",
  signIn: () => {},
  signOut: () => {},
};

export const AuthContext = createContext<any>(defaultAuthContext);

export function useCustomAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}

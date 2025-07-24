"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated as checkAuth, getAuthToken } from "@/actions/auth";

const AuthContext = createContext({
  isAuthenticated: false,
  refreshAuth: () => {},
  authToken: null as string | null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const refreshAuth = async () => {
    const authenticated = await checkAuth();
    console.log("authenticated", authenticated)
    setIsAuthenticated(authenticated);
    setAuthToken(authenticated ? await getAuthToken() : null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, refreshAuth, authToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
"use client";
import { AuthProvider } from "@asgardeo/auth-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider
        config={{
            signInRedirectURL: process.env.NEXT_PUBLIC_ASGARDEO_REDIRECT_URL || "http://localhost:3000",
            signOutRedirectURL: process.env.NEXT_PUBLIC_ASGARDEO_REDIRECT_URL || "http://localhost:3000",
            clientID: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID || "",
            baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL || "",
            scope: ["openid", "profile"]
        }}
    >
      {children}
    </AuthProvider>
  );
}

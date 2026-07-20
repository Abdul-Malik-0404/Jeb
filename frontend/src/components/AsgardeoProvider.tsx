"use client";

import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import { AuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

function AuthBridge({ children }: { children: React.ReactNode }) {
  const auth = useAuthContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AsgardeoProvider({ children }: { children: React.ReactNode }) {
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
      <AuthBridge>{children}</AuthBridge>
    </AuthProvider>
  );
}

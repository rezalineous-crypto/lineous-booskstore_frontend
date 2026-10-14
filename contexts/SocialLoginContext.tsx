"use client";

import React, { createContext, useContext, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { SocialProfile, SocialLoginError } from "@/lib/social-login";

const SocialLoginContext = createContext<{
  authenticate: (
    profile: SocialProfile & { provider: "GOOGLE" | "FACEBOOK" | "APPLE" },
  ) => Promise<void>;
} | null>(null);

export const SocialLoginProvider = ({ children }: { children: ReactNode }) => {
  // AuthContext.socialLogin is the single owner of the social-login mutation.
  // Calling the mutation here as well would fire a duplicate API request.
  const { socialLogin } = useAuth();

  const authenticate = useCallback(
    async (
      profile: SocialProfile & { provider: "GOOGLE" | "FACEBOOK" | "APPLE" },
    ) => {
      await socialLogin(
        profile.provider,
        profile.providerId,
        profile.email,
        profile.firstName,
        profile.lastName,
        profile.avatar,
      );
    },
    [socialLogin],
  );

  return (
    <SocialLoginContext.Provider value={{ authenticate }}>
      {children}
    </SocialLoginContext.Provider>
  );
};

export const useSocialLoginContext = () => {
  const context = useContext(SocialLoginContext);
  if (!context) {
    throw new Error(
      "useSocialLoginContext must be used within SocialLoginProvider",
    );
  }
  return context;
};

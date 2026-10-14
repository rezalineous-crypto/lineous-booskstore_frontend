"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, setToken } from "@/lib/api-client";
import { AuthResponse } from "@/lib/types";

export type SocialProvider = "GOOGLE" | "FACEBOOK" | "APPLE";

interface SocialLoginPayload {
  email: string;
  provider: SocialProvider;
  providerId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface SocialLoginResult extends AuthResponse {
  isNewUser?: boolean;
}

export const useSocialLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<SocialLoginResult, Error, SocialLoginPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<AuthResponse>("/auth/social-login", payload);
      return response as unknown as SocialLoginResult;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      // Only refresh user-scoped data. Clearing the whole cache here would
      // wipe public data (books, categories, menu tree) and cause refetch storms.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

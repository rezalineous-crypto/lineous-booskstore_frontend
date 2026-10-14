import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { getFriendlyErrorMessage, logError } from "@/lib/error-messages";

// Utility function for handling API errors with sonner.
// Shows a friendly, user-safe message; technical details go to the console only.
export const handleApiError = (error: unknown) => {
  toast.error(getFriendlyErrorMessage(error));
  logError(error);
};

// Base query hook with error handling
export const useApiQuery = <T>(
  key: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<T>(endpoint);
      return response.data;
    },
    ...options,
  });
};

// Base mutation hook with error handling
export const useApiMutation = <T, V = unknown>(
  endpoint: string,
  method: "POST" | "PATCH" | "DELETE",
  options?: Omit<UseMutationOptions<T, Error, V>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, V>({
    mutationFn: async (data: V) => {
      let response;
      if (method === "POST") {
        response = await apiClient.post<T>(endpoint, data);
      } else if (method === "PATCH") {
        response = await apiClient.patch<T>(endpoint, data);
      } else {
        response = await apiClient.delete<T>(endpoint);
      }
      return response.data;
    },
    onError: (error) => {
      handleApiError(error);
    },
    ...options,
  });
};
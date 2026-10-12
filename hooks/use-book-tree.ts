"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { BookTreeResponse } from "@/lib/types";

export const useBookTree = (categoryId?: string) => {
  return useQuery<BookTreeResponse, Error>({
    queryKey: ["books", "tree", categoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      const url = params.toString() ? `/books/tree?${params.toString()}` : "/books/tree";
      const response = await apiClient.get<BookTreeResponse | unknown>(url);
      const data = (response as { data?: BookTreeResponse }).data ?? response;
      if (!Array.isArray(data)) {
        throw new Error("Invalid book tree data");
      }
      return data;
    },
  });
};

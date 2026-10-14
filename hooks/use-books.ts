"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Book } from "@/lib/types";

// Get all books or books by subject/category/search
export const useBooks = (
  subjectId?: string,
  categoryId?: string,
  search?: string,
  enabled = true,
) => {
  return useQuery<Book[], Error>({
    queryKey: ["books", subjectId, categoryId, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (subjectId) params.append("subjectId", subjectId);
      if (categoryId) params.append("categoryId", categoryId);
      if (search) params.append("search", search);
      if (search) params.append("q", search);
      if (search) params.append("query", search);
      const url = params.toString() ? `/books?${params.toString()}` : "/books";
      const response = await apiClient.get<Book[]>(url);
      return response.data;
    },
    enabled,
  });
};

// Get book by ID
export const useBook = (id: string) => {
  return useQuery<Book, Error>({
    queryKey: ["books", id],
    queryFn: async () => {
      const response = await apiClient.get<Book>(`/books/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
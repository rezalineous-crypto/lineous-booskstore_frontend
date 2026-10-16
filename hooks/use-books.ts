"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Book } from "@/lib/types";

// Get all books or books by subject/category/search
export interface BooksResponse {
  books: Book[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useBooks = (
  subjectId?: string,
  categoryId?: string,
  search?: string,
  page = 1,
  limit = 20,
  enabled = true,
) => {
  return useQuery<BooksResponse, Error>({
    queryKey: ["books", subjectId, categoryId, search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (subjectId) params.append("subjectId", subjectId);
      if (categoryId) params.append("categoryId", categoryId);
      if (search) params.append("q", search);
      params.append("page", String(page));
      params.append("limit", String(limit));
      const url = `/books?${params.toString()}`;
      const response = await apiClient.get<Book[]>(url);
      const data = response.data as unknown as { data?: Book[]; meta?: BooksResponse["meta"] };
      return {
        books: Array.isArray(data) ? data : (data?.data || []),
        meta: data?.meta || { page, limit, total: 0, pages: 1 },
      };
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
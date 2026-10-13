"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Category, MenuTreeResponse } from "@/lib/types";

// Get all categories
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get<Category[]>("/categories");
      return response.data;
    },
  });
};

// Get category by ID
export const useCategory = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get categories menu
export const useCategoriesMenu = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories", "menu"],
    queryFn: async () => {
      const response = await apiClient.get<Category[]>("/categories/menu");
      return response.data;
    },
  });
};

// Get categories menu tree (Category → Publication → Subject → Book)
export const useCategoriesMenuTree = () => {
  return useQuery<MenuTreeResponse, Error>({
    queryKey: ["categories", "menu-tree"],
    queryFn: async () => {
      const response = await apiClient.get<MenuTreeResponse>("/categories/menu/tree");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime in v5 is gcTime)
  });
};

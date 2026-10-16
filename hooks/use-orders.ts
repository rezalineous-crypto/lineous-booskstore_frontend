"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiError, getToken, BASE_URL } from "@/lib/api-client";
import { Order, Receipt } from "@/lib/types";

// Get all orders (paginated)
export interface OrdersResponse {
  orders: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useOrders = (userId?: string, categoryId?: string, page = 1, limit = 20) => {
  return useQuery<OrdersResponse, Error>({
    queryKey: ["orders", userId, categoryId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      params.append("page", String(page));
      params.append("limit", String(limit));
      const url = `/orders?${params.toString()}`;
      const response = await apiClient.get<Order[]>(url);
      const data = response.data as unknown as { data?: Order[]; meta?: OrdersResponse["meta"] };
      return {
        orders: Array.isArray(data) ? data : (data?.data || []),
        meta: data?.meta || { page, limit, total: 0, pages: 1 },
      };
    },
    // Orders are user-scoped: don't fire (and 401) for guests
    enabled: !!userId,
  });
};

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, string>({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.post<Order>(`/orders/${orderId}/cancel`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to cancel order");
      }
    },
  });
};

// Return order
export const useReturnOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, string>({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.post<Order>(`/orders/${orderId}/return`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order return requested successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to request return");
      }
    },
  });
};

// Get order by ID
export const useOrder = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { addressId: string; discount?: number; shipping?: number; paymentMethod?: string; notes?: string }>({
    mutationFn: async (data) => {
      const response = await apiClient.post<Order>("/orders", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    },
  });
};

// Verify receipt by receipt number (public endpoint)
export const useVerifyReceipt = (receiptNumber: string) => {
  return useQuery<Receipt, Error>({
    queryKey: ["receipt", receiptNumber],
    queryFn: async () => {
      const response = await apiClient.get<Receipt>(
        `/receipts/verify/${receiptNumber}`
      );
      return response.data;
    },
    enabled: !!receiptNumber,
  });
};

// Download receipt PDF (auth required). The token-bearing fetch receives the
// PDF bytes; we turn that into a client-side download so no second (token-less)
// browser navigation is made.
export const useDownloadReceipt = () => {
  return useMutation<
    void,
    ApiError,
    { orderId: string; orderNumber?: string }
  >({
    mutationFn: async ({ orderId, orderNumber }) => {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/orders/${orderId}/receipt`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        redirect: "follow",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(
          data.message || "Failed to download receipt",
          response.status,
          data.errors
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const baseName = (orderNumber || orderId).replace(/^ORD-/, "");
      const a = document.createElement("a");
      a.href = url;
      a.download = `CLC-ORD-${baseName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to download receipt");
      }
    },
  });
};

// Load receipt PDF as a client-side object URL for inline preview (auth required).
export const useReceiptPreview = (orderId: string | null) => {
  return useQuery<string, ApiError>({
    queryKey: ["receipt-preview", orderId],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/orders/${orderId}/receipt`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        redirect: "follow",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(
          data.message || "Failed to load receipt",
          response.status,
          data.errors
        );
      }

      const blob = await response.blob();
      return window.URL.createObjectURL(blob);
    },
    enabled: !!orderId,
  });
};
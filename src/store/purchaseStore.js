import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const usePurchaseStore = create((set) => ({
  purchases: [],
  currentPurchase: null,
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchPurchases: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/purchases", { params });
      const purchases = res.data?.data || [];
      set({ purchases, isLoading: false });
      return purchases;
    } catch (error) {
      const message = normalizeError(error, "Failed to load purchases");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchPurchaseById: async (purchaseId) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/purchases/${purchaseId}`);
      const purchase = res.data?.data;
      set({ currentPurchase: purchase, isLoading: false });
      return purchase;
    } catch (error) {
      const message = normalizeError(error, "Failed to load purchase details");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createPurchase: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/purchases", payload);
      const purchase = res.data?.data;

      set((state) => ({
        purchases: [purchase, ...state.purchases],
        isSubmitting: false,
      }));

      return purchase;
    } catch (error) {
      const message = normalizeError(error, "Failed to create purchase");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updatePurchaseStatus: async (purchaseId, status) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/purchases/${purchaseId}/status`, { status });
      const purchase = res.data?.data;

      set((state) => ({
        purchases: state.purchases.map((item) =>
          item.purchase_id === purchaseId ? purchase : item,
        ),
        isSubmitting: false,
      }));

      return purchase;
    } catch (error) {
      const message = normalizeError(error, "Failed to update purchase status");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deletePurchase: async (purchaseId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/purchases/${purchaseId}`);

      set((state) => ({
        purchases: state.purchases.filter(
          (item) => item.purchase_id !== purchaseId,
        ),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete purchase");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));

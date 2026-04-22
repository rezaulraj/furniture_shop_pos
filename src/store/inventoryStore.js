import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useInventoryStore = create((set) => ({
  inventory: [],
  stockAlerts: [],
  isLoading: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchInventory: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/inventory", { params });
      const inventory = res.data?.data || [];
      set({ inventory, isLoading: false });
      return inventory;
    } catch (error) {
      const message = normalizeError(error, "Failed to load inventory");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchStockAlerts: async () => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/stock-alerts");
      const stockAlerts = res.data?.data || [];
      set({ stockAlerts, isLoading: false });
      return stockAlerts;
    } catch (error) {
      const message = normalizeError(error, "Failed to load stock alerts");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  adjustStock: async (payload) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.post("/inventory/adjust", payload);
      const adjustment = res.data?.data;
      
      // Refresh inventory after adjustment
      const inventoryRes = await api.get("/inventory");
      set({ inventory: inventoryRes.data?.data || [], isLoading: false });
      
      return adjustment;
    } catch (error) {
      const message = normalizeError(error, "Failed to adjust stock");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));

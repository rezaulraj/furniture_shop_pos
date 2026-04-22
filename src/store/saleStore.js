import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useSaleStore = create((set, get) => ({
  sales: [],
  currentSale: null,
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchSales: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/sales", { params });
      const sales = res.data?.data || [];
      set({ sales, isLoading: false });
      return sales;
    } catch (error) {
      const message = normalizeError(error, "Failed to load sales");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchSaleById: async (saleId) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/sales/${saleId}`);
      const sale = res.data?.data;
      set({ currentSale: sale, isLoading: false });
      return sale;
    } catch (error) {
      const message = normalizeError(error, "Failed to load sale details");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createSale: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/sales", payload);
      const sale = res.data?.data;

      set((state) => ({
        sales: [sale, ...state.sales],
        isSubmitting: false,
      }));

      return sale;
    } catch (error) {
      const message = normalizeError(error, "Failed to create sale");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateSaleStatus: async (saleId, status) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/sales/${saleId}/status`, { status });
      const sale = res.data?.data;

      set((state) => ({
        sales: state.sales.map((item) => (item.sale_id === saleId ? sale : item)),
        isSubmitting: false,
      }));

      return sale;
    } catch (error) {
      const message = normalizeError(error, "Failed to update sale status");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteSale: async (saleId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/sales/${saleId}`);

      set((state) => ({
        sales: state.sales.filter((item) => item.sale_id !== saleId),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete sale");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));

import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useCustomerStore = create((set) => ({
  customers: [],
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchCustomers: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/customers", { params });
      const customers = res.data?.data || [];
      set({ customers, isLoading: false });
      return customers;
    } catch (error) {
      const message = normalizeError(error, "Failed to load customers");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createCustomer: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/customers", payload);
      const customer = res.data?.data;

      set((state) => ({
        customers: [customer, ...state.customers],
        isSubmitting: false,
      }));

      return customer;
    } catch (error) {
      const message = normalizeError(error, "Failed to create customer");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateCustomer: async (customerId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/customers/${customerId}`, payload);
      const customer = res.data?.data;

      set((state) => ({
        customers: state.customers.map((item) =>
          item.customer_id === customerId ? customer : item,
        ),
        isSubmitting: false,
      }));

      return customer;
    } catch (error) {
      const message = normalizeError(error, "Failed to update customer");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/customers/${customerId}`);

      set((state) => ({
        customers: state.customers.filter(
          (item) => item.customer_id !== customerId,
        ),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete customer");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));

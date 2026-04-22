import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useBranchStore = create((set) => ({
  branches: [],
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchBranches: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/branches", { params });
      const branches = res.data?.data || [];
      set({ branches, isLoading: false });
      return branches;
    } catch (error) {
      const message = normalizeError(error, "Failed to load branches");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createBranch: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/branches", payload);
      const branch = res.data?.data;

      set((state) => ({
        branches: [branch, ...state.branches],
        isSubmitting: false,
      }));

      return branch;
    } catch (error) {
      const message = normalizeError(error, "Failed to create branch");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateBranch: async (branchId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/branches/${branchId}`, payload);
      const branch = res.data?.data;

      set((state) => ({
        branches: state.branches.map((item) =>
          item.branch_id === branchId ? branch : item,
        ),
        isSubmitting: false,
      }));

      return branch;
    } catch (error) {
      const message = normalizeError(error, "Failed to update branch");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteBranch: async (branchId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/branches/${branchId}`);

      set((state) => ({
        branches: state.branches.filter((item) => item.branch_id !== branchId),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete branch");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));

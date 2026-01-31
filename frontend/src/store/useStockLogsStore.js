import { create } from "zustand";
import api from "../api/api";
// api = axios instance with baseURL + auth headers

export const useStockLogsStore = create((set) => ({
  // ================= STATE =================
  logs: [],
  updatedProduct: null,
  isLoading: false,
  error: null,

  // ================= ACTIONS =================

  // Adjust product stock
  adjustStock: async ({ productId, amount, note = "" }) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.put(`/products/${productId}/adjust-stock`, {
        amount,
        note
      });

      const { product, log } = res.data;

      set(state => ({
        isLoading: false,
        updatedProduct: product,
        logs: [log, ...state.logs] // prepend latest log
      }));

      return product;
    } catch (error) {
      console.error("adjustStock error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to adjust stock"
      });
      throw error;
    }
  },

  // Fetch stock logs
  fetchStockLogs: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.get("/stockLogs/getStockLogs");
      set({
        logs: res.data,
        isLoading: false
      });
    } catch (error) {
      console.error("fetchStockLogs error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch stock logs"
      });
    }
  },

  // ================= HELPERS =================
  clearError: () => set({ error: null }),
  clearUpdatedProduct: () => set({ updatedProduct: null })
}));



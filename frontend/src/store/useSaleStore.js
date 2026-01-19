import { create } from "zustand";
import api from "../api/api";

export const useSaleStore = create((set) => ({
  // ===== STATE =====
  stats: {
    totalRevenue: 0,
    totalItemsSold: 0,
    totalProfit: 0
  },
  isLoading: false,
  error: null,

  // ===== ACTIONS =====
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.get("/sales/stats");

      set({
        stats: res.data,
        isLoading: false
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load stats",
        isLoading: false
      });
    }
  },

  resetStats: () =>
    set({
      stats: {
        totalRevenue: 0,
        totalItemsSold: 0,
        totalProfit: 0
      }
    })
}));

import { create } from "zustand";
import api from "../api/api";

export const useSaleStore = create((set) => ({
  sales:[],
  // ===== STATE =====
  stats: {
    totalRevenue: 0,
    totalItemsSold: 0,
    totalProfit: 0,
    salesData:[]
  },
  isLoading: false,
  error: null,
  lastSale: null,

  // ===== ACTIONS =====
fetchDashboardStats: async () => {
  set({ isLoading: true, error: null });
  try {
    const res = await api.get("/sales/stats");

    set((state) => ({
      stats: {
        ...state.stats,   // 👈 keep salesData
        ...res.data       // 👈 override only what exists
      },
      isLoading: false
    }));
  } catch (err) {
    set({
      error: err.response?.data?.message || "Failed to load stats",
      isLoading: false
    });
  }
},



checkoutSale: async ({ cart, paymentMethod = "cash", cashierName}) => {
  set({ isLoading: true, error: null });

  const payload = {
    items: cart.map(item => ({
      productId: item.product._id,
      quantity: item.quantity
    })),
    paymentMethod,
    cashierName
  };

  try {
    const res = await api.post("/sales/createSale", payload);

    set({
      lastSale: res.data,
      isLoading: false
    });

    return res.data;
  } catch (err) {
    set({
      error: err.response?.data?.message || "Checkout failed",
      isLoading: false
    });
    throw err;
  }
},
fetchPurchaseLogs: async () => {
  set({ isLoading: true, error: null });
  try {
    const res = await api.get("/sales/salesLogs");

    const salesArray = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    set({ sales: salesArray, isLoading: false });
  } catch (error) {
    set({
      error: error.response?.data?.message || "Failed to fetch sales logs",
      isLoading: false
    });
    throw error;
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

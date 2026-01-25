import { create } from "zustand";
import api from "../api/api";

export const useSaleStore = create((set) => ({
  sales:[],
  // ===== STATE =====
  stats: {
    totalRevenue: 0,
    totalItemsSold: 0,
    totalProfit: 0
  },
  isLoading: false,
  error: null,
  lastSale: null,

  // ===== ACTIONS =====
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/sales/stats");
      set({ stats: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load stats",
        isLoading: false
      });
    }
  },
checkoutSale: async ({ cart, paymentMethod = "cash" }) => {
  set({ isLoading: true, error: null });

  const payload = {
    items: cart.map(item => ({
      productId: item.product._id,
      quantity: item.quantity
    })),
    paymentMethod
  };

  try {
    const res = await api.post("/sales/createSale", payload);

    set({
      lastSale: res.data,
      isLoading: false
    });

    return res.data; // 👈 THIS is the key line
  } catch (err) {
    set({
      error: err.response?.data?.message || "Checkout failed",
      isLoading: false
    });
    throw err;
  }
},
fetchPurchaseLogs: async () => {
  set({isLoading: true, error: null});
  try {
     const res = await api.get("/sales/salesLogs");
      set({ sales: res.data, isLoading: false });
  } catch (error) {
      set({
      error: err.response?.data?.message || "Checkout failed",
      isLoading: false
    });
    throw err;
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

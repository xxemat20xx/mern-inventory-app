import { create } from "zustand";
import api from '../api/api';

export const useInventoryStore = create((set) => ({
    products: [],
    error: null,
    isLoading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        try {
            const response = await api.post("/products/create", productData);
            set((state) => ({
                products: [...state.products, response.data],
                isLoading: false,
            }))
        } catch (error) {
            console.log(error);
            set({ error: error.response.data.message, isLoading: false });
        }
    },
    getProducts: async () => {
    set({ isLoading: true, error: null });
    try {
        const response = await api.get('/products/get');
        set({ products: Array.isArray(response.data) ? response.data : [], isLoading: false });
    } catch (error) {
        console.log(error);
        set({ error: error.response?.data?.message, isLoading: false });
    }
    },
    updateProduct: async (productId, productData) => {
        try {
            const response = await api.put(`/products/update/${productId}`, productData);
            set((state) => ({
                products: state.products.map((product) => product._id === productId ? response.data : product),
                isLoading: false,
            }));
        } catch (error) {
            console.log(error);
            set({ error: error.response.data.message, isLoading: false });
        }
    },
    deleteProduct: async (productId) => {
        try {
            await api.delete(`/products/delete/${productId}`);
            set((state) => ({
                products: state.products.filter((product) => product._id !== productId),
                isLoading: false,
            }));
        } catch (error) {
            console.log(error);
            set({ error: error.response.data.message, isLoading: false });
        }
    },
    resetError: () => set({ error: null })

}))
import { create } from 'zustand';
import api from '../api/api';


export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message, isLoading: false });
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/auth/logout');
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message, isLoading: false });
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
        const response = await api.get('/auth/checkAuth');
        set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
        set({ user: null, isAuthenticated: false, isCheckingAuth: false }); 
        console.error(error)
        }
    },
}));


import { create } from 'zustand';
import * as authService from '@/services/authService';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    // Registra um novo usuário
    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await authService.register(name, email, password);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao registrar usuário';
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },

    // Faz login
    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await authService.login(email, password);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },

    // Verifica autenticação e carrega dados do usuário
    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false, user: null, token: null });
            return;
        }

        set({ loading: true });
        try {
            const data = await authService.getCurrentUser();
            set({
                user: data.data,
                isAuthenticated: true,
                loading: false,
            });
        } catch (error) {
            // Token inválido ou expirado
            localStorage.removeItem('token');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    },

    // Faz logout
    logout: () => {
        authService.logout();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },

    // Limpa erro
    clearError: () => set({ error: null }),
}));

export default useAuthStore;

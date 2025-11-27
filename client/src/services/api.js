import axios from 'axios';

// Em produção (Vercel), usa a variável de ambiente.
// Em desenvolvimento (Antigravity), usa o proxy '/api/v1'.
const baseURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1` // Adiciona /api/v1 se vier da ENV
    : '/api/v1';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

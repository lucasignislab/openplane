import api from './api';

/**
 * Registra um novo usuário
 * @param {string} name - Nome do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} Response com token e dados do usuário
 */
export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

/**
 * Faz login de um usuário existente
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} Response com token e dados do usuário
 */
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

/**
 * Obtém os dados do usuário atual autenticado
 * @returns {Promise} Dados do usuário
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

/**
 * Faz logout do usuário
 */
export const logout = () => {
    localStorage.removeItem('token');
};

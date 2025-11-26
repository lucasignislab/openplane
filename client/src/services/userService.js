import api from './api';

const userService = {
    // Obter perfil do usuário atual
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    // Atualizar perfil do usuário
    updateProfile: async (userData) => {
        const response = await api.put('/users/me', userData);
        return response.data;
    }
};

export default userService;

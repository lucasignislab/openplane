import api from './api';

const workspaceService = {
    // Criar novo workspace
    create: async (workspaceData) => {
        const response = await api.post('/workspaces', workspaceData);
        return response.data;
    },

    // Listar workspaces do usuário
    getAll: async () => {
        const response = await api.get('/workspaces');
        return response.data;
    },

    // Obter workspace por slug
    getBySlug: async (slug) => {
        const response = await api.get(`/workspaces/${slug}`);
        return response.data;
    }
};

export default workspaceService;

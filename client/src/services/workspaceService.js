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
    },

    // Atualizar Workspace (nome/logo)
    update: async (id, data) => {
        const response = await api.patch(`/workspaces/${id}`, data);
        return response.data;
    },

    // Convidar membro por email
    inviteMember: async (workspaceId, email, role) => {
        const response = await api.post(`/workspaces/${workspaceId}/members`, { email, role });
        return response.data;
    },

    // Remover membro
    removeMember: async (workspaceId, userId) => {
        const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
        return response.data;
    }
};

export default workspaceService;

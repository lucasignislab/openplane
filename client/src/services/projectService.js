import api from './api';

const projectService = {
    // Criar novo projeto
    create: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    // Listar projetos do workspace
    getAll: async (workspaceId) => {
        const response = await api.get(`/projects?workspaceId=${workspaceId}`);
        return response.data;
    },

    // Obter detalhes do projeto
    getById: async (projectId) => {
        const response = await api.get(`/projects/${projectId}`);
        return response.data;
    },

    // Atualizar projeto
    update: async (projectId, projectData) => {
        const response = await api.put(`/projects/${projectId}`, projectData);
        return response.data;
    },

    // Deletar projeto
    delete: async (projectId) => {
        const response = await api.delete(`/projects/${projectId}`);
        return response.data;
    }
};

export default projectService;

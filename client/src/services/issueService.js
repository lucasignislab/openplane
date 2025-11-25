import api from './api';

const issueService = {
    // Obter detalhes completos (incluindo activity log se o backend suportar ou fizermos endpoints separados)
    getById: async (issueId) => {
        const response = await api.get(`/issues/${issueId}`); // Precisamos garantir que essa rota existe/retorna o que precisamos
        return response.data;
    },

    // Buscar comentários
    getComments: async (issueId) => {
        const response = await api.get(`/issues/${issueId}/comments`); // Rota que criamos antes?
        return response.data;
    },

    // Postar comentário
    addComment: async (issueId, text) => {
        const response = await api.post(`/issues/${issueId}/comments`, { text });
        return response.data;
    },

    // Buscar atividades (Log)
    getActivities: async (issueId) => {
        // Precisamos criar essa rota no backend se não existir, 
        // mas vamos assumir por hora que usamos a rota genérica de activities filtrada
        // Para o MVP, vamos focar nos comentários primeiro.
        return [];
    }
};

export default issueService;

import api from './api';

// Buscar Issues por Projeto
export const getByProject = async (projectId) => {
    const response = await api.get(`/issues?projectId=${projectId}`);
    return response.data;
};

// Criar Issue
export const create = async (issueData) => {
    const response = await api.post('/issues', issueData);
    return response.data;
};

// Atualizar Issue
export const update = async (issueId, issueData) => {
    const response = await api.put(`/issues/${issueId}`, issueData);
    return response.data;
};

// Deletar Issue
export const deleteIssue = async (issueId) => {
    const response = await api.delete(`/issues/${issueId}`);
    return response.data;
};

// Obter detalhes completos
export const getById = async (issueId) => {
    const response = await api.get(`/issues/${issueId}`);
    return response.data;
};

// Buscar comentários
export const getComments = async (issueId) => {
    const response = await api.get(`/issues/${issueId}/comments`);
    return response.data;
};

// Postar comentário
export const addComment = async (issueId, text) => {
    const response = await api.post(`/issues/${issueId}/comments`, { text });
    return response.data;
};

// Buscar atividades (Log)
export const getActivities = async (issueId) => {
    // Placeholder para futuro endpoint de atividades
    return [];
};

const issueService = {
    getByProject,
    create,
    update,
    deleteIssue,
    getById,
    getComments,
    addComment,
    getActivities
};

export default issueService;

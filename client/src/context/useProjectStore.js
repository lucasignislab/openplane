import { create } from 'zustand';
import projectService from '../services/projectService';

const useProjectStore = create((set) => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,

    // Buscar projetos por workspace
    fetchProjects: async (workspaceId) => {
        set({ isLoading: true, error: null });

        try {
            const res = await projectService.getAll(workspaceId);
            set({
                projects: res.data,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Erro ao carregar projetos',
                isLoading: false,
            });
        }
    },

    // Criar novo projeto
    createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await projectService.create(projectData);
            set(state => ({
                projects: [...state.projects, res.data],
                isLoading: false
            }));
            return res.data;
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Erro ao criar projeto',
                isLoading: false,
            });
            return null;
        }
    },

    // Definir projeto atual
    setCurrentProject: (project) => set({ currentProject: project }),

    // Limpar erro
    clearError: () => set({ error: null }),
}));

export default useProjectStore;

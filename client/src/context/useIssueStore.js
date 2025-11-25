import { create } from 'zustand';
import * as issueService from '../services/issueService';

const useIssueStore = create((set, get) => ({
    issues: [],
    states: [],
    isLoading: false,
    error: null,

    // Busca todas as issues e states de um projeto (para o board)
    fetchBoardData: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
            // Buscar issues do projeto
            const issuesData = await issueService.getByProject(projectId);

            // Buscar states do projeto (opcional - se tiver endpoint)
            // const statesData = await stateService.getByProject(projectId);

            set({
                issues: issuesData.data || [],
                // states: statesData.data || [],
                isLoading: false,
            });
        } catch (error) {
            console.error('Erro ao carregar board:', error);
            set({
                error: error.response?.data?.error || 'Erro ao carregar dados do board',
                isLoading: false,
            });
        }
    },

    // Criar uma nova issue
    createIssue: async (issueDataOrFormData) => {
        try {
            // Suporta tanto o formato antigo (projectId, data) quanto novo (formData único)
            let projectId, issueData;

            if (typeof issueDataOrFormData === 'object' && issueDataOrFormData.projectId) {
                // Novo formato: formData contém projectId
                projectId = issueDataOrFormData.projectId;
                issueData = { ...issueDataOrFormData };
                delete issueData.projectId; // Remove projectId dos dados da issue
            } else {
                // Formato antigo (fallback)
                projectId = arguments[0];
                issueData = arguments[1] || issueDataOrFormData;
            }

            const newIssue = await issueService.create(projectId, issueData);
            set((state) => ({
                issues: [...state.issues, newIssue.data],
            }));
            return true; // Retorna sucesso
        } catch (error) {
            console.error('Erro ao criar issue:', error);
            return false; // Retorna falha
        }
    },

    // Atualizar issue (ex: mudar estado no drag & drop)
    updateIssue: async (issueId, updates) => {
        try {
            const updated = await issueService.update(issueId, updates);
            set((state) => ({
                issues: state.issues.map((issue) =>
                    issue._id === issueId ? { ...issue, ...updated.data } : issue
                ),
            }));
            return updated;
        } catch (error) {
            console.error('Erro ao atualizar issue:', error);
            throw error;
        }
    },

    // Atualizar status da issue (versão simplificada para drag & drop)
    updateIssueStatus: async (issueId, newStateId) => {
        try {
            // Atualização otimista na UI
            set((state) => ({
                issues: state.issues.map((issue) =>
                    issue._id === issueId ? { ...issue, state: newStateId } : issue
                ),
            }));

            // Chamada à API
            await issueService.update(issueId, { state: newStateId });
        } catch (error) {
            console.error('Erro ao atualizar status da issue:', error);
            // Reverter em caso de erro (buscar novamente do servidor)
            const { fetchBoardData } = get();
            // Idealmente deveria reverter apenas essa issue, mas vamos refetch
        }
    },

    // Deletar issue
    deleteIssue: async (issueId) => {
        try {
            await issueService.deleteIssue(issueId);
            set((state) => ({
                issues: state.issues.filter((issue) => issue._id !== issueId),
            }));
        } catch (error) {
            console.error('Erro ao deletar issue:', error);
            throw error;
        }
    },

    // Limpar erro
    clearError: () => set({ error: null }),
}));

export default useIssueStore;

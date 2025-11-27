import { create } from 'zustand';
import workspaceService from '@/services/workspaceService';

const useWorkspaceStore = create((set) => ({
    workspaces: [],
    currentWorkspace: null,
    isLoading: false,
    error: null,

    // Definir workspace atual (mock por enquanto)
    setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

    // Buscar workspaces do usuário
    fetchWorkspaces: async () => {
        set({ isLoading: true });
        try {
            const res = await workspaceService.getAll();
            let workspaces = res.data;
            let current = null;

            // Se não tiver workspace, cria um padrão automaticamente
            if (workspaces.length === 0) {
                try {
                    const newWorkspaceRes = await workspaceService.create({ name: 'Meu Workspace' });
                    workspaces = [newWorkspaceRes.data];
                    current = newWorkspaceRes.data;
                } catch (createErr) {
                    console.error("Erro ao criar workspace automático:", createErr);
                }
            } else {
                current = workspaces[0];
            }

            set({
                workspaces: workspaces,
                currentWorkspace: current,
                isLoading: false,
            });
        } catch (error) {
            console.error("Erro ao buscar workspaces:", error);
            set({ isLoading: false, error: error.message });
        }
    },
}));

export default useWorkspaceStore;

import { create } from 'zustand';

const useUIStore = create((set) => ({
    // Modal de criação de issue
    isIssueModalOpen: false,
    openIssueModal: () => set({ isIssueModalOpen: true }),
    closeIssueModal: () => set({ isIssueModalOpen: false }),

    // Sidebar colapsada/expandida
    isSidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    // Toast notifications (para futuro uso)
    toasts: [],
    addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { ...toast, id: Date.now() }]
    })),
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    })),
}));

export default useUIStore;

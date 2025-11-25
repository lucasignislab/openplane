import api from './api';

const cycleService = {
    getAll: async (projectId) => {
        const response = await api.get(`/cycles?projectId=${projectId}`);
        return response.data;
    },
    getById: async (cycleId) => {
        const response = await api.get(`/cycles/${cycleId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/cycles', data);
        return response.data;
    }
};

export default cycleService;

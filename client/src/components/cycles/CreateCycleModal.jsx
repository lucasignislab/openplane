import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api'; // Atalho direto ou use a store

const CreateCycleModal = ({ isOpen, onClose, projectId, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cycles', { ...formData, projectId });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Criar Novo Ciclo</h2>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Ciclo</label>
                        <input
                            className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Sprint 24 - Core Features"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Início</label>
                            <input type="date" className="w-full px-3 py-2 border rounded-md text-sm"
                                value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Fim</label>
                            <input type="date" className="w-full px-3 py-2 border rounded-md text-sm"
                                value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                        Criar Ciclo
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCycleModal;

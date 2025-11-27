import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import useProjectStore from '@/context/useProjectStore';
import useWorkspaceStore from '@/context/useWorkspaceStore';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { createProject, error } = useProjectStore();
    const { currentWorkspace } = useWorkspaceStore();
    const [formData, setFormData] = useState({
        name: '',
        identifier: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentWorkspace) {
            alert('Erro: Nenhum workspace selecionado. Tente recarregar a página.');
            return;
        }

        setIsSubmitting(true);
        const newProject = await createProject({
            ...formData,
            workspaceId: currentWorkspace._id
        });
        setIsSubmitting(false);

        if (newProject) {
            setFormData({ name: '', identifier: '', description: '' });
            onClose();
            navigate(`/projects/${newProject._id}`);
        }
    };

    // Gerar identificador automaticamente
    const handleNameChange = (e) => {
        const name = e.target.value;
        // Tenta gerar um identificador de 3-4 letras baseado no nome
        const generatedId = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, '');

        setFormData(prev => ({
            ...prev,
            name,
            identifier: prev.identifier ? prev.identifier : generatedId
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Criar Novo Projeto</h2>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Projeto</label>
                        <input
                            className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Marketing Website"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Identificador (ex: MKT)</label>
                        <input
                            className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                            placeholder="MKT"
                            value={formData.identifier}
                            onChange={e => setFormData({ ...formData, identifier: e.target.value.toUpperCase() })}
                            required
                            maxLength={5}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Descrição (Opcional)</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descreva o objetivo deste projeto..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Criando...' : 'Criar Projeto'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;

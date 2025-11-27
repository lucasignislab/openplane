import { useState, useEffect } from 'react';
import useWorkspaceStore from '@/context/useWorkspaceStore';
import workspaceService from '@/services/workspaceService';

const GeneralSettings = () => {
    const { currentWorkspace, fetchWorkspaces } = useWorkspaceStore();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (currentWorkspace) setName(currentWorkspace.name);
    }, [currentWorkspace]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await workspaceService.update(currentWorkspace._id, { name });
            await fetchWorkspaces(); // Atualiza a sidebar global
            setMessage({ type: 'success', text: 'Workspace atualizado com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar workspace.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Geral</h2>
            <p className="text-sm text-slate-500 mb-6">Gerencie os detalhes do seu workspace.</p>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Workspace</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {message.text && (
                        <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading || name === currentWorkspace?.name}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GeneralSettings;

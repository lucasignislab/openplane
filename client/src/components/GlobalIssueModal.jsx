import { useState, useEffect } from 'react';
import { X, User, Circle, Repeat } from 'lucide-react';
import useUIStore from '../context/useUIStore';
import useWorkspaceStore from '../context/useWorkspaceStore';
import useProjectStore from '../context/useProjectStore';
import useIssueStore from '../context/useIssueStore';
import RichTextEditor from './ui/RichTextEditor';
import api from '../services/api';
import cycleService from '../services/cycleService';

const GlobalIssueModal = () => {
    const { isIssueModalOpen, closeIssueModal } = useUIStore();
    const { currentWorkspace } = useWorkspaceStore();
    const { projects, fetchProjects } = useProjectStore();
    const { createIssue } = useIssueStore();

    // Estados locais para os dropdowns dinâmicos
    const [availableStates, setAvailableStates] = useState([]);
    const [availableMembers, setAvailableMembers] = useState([]);
    const [availableCycles, setAvailableCycles] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'none',
        projectId: '',
        stateId: '',
        assignees: [],
        cycleId: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Carregar projetos ao abrir
    useEffect(() => {
        if (isIssueModalOpen && currentWorkspace) {
            fetchProjects(currentWorkspace._id);
            setAvailableMembers(currentWorkspace.members || []);
        }
    }, [isIssueModalOpen, currentWorkspace, fetchProjects]);

    // 2. Selecionar projeto padrão
    useEffect(() => {
        if (projects.length > 0 && !formData.projectId) {
            setFormData(prev => ({ ...prev, projectId: projects[0]._id }));
        }
    }, [projects, formData.projectId]);

    // 3. Buscar Estados quando o Projeto mudar
    useEffect(() => {
        const fetchStates = async () => {
            if (formData.projectId) {
                try {
                    const res = await api.get(`/projects/${formData.projectId}/states`);
                    setAvailableStates(res.data.data || []);
                    if (res.data.data && res.data.data.length > 0) {
                        setFormData(prev => ({ ...prev, stateId: res.data.data[0]._id }));
                    }
                } catch (error) {
                    console.error("Erro ao buscar estados", error);
                    // Fallback: usar estado mock se API falhar
                    const mockStates = [
                        { _id: 'backlog', name: 'Backlog', color: '#64748b' },
                        { _id: 'todo', name: 'To Do', color: '#94a3b8' },
                        { _id: 'in-progress', name: 'In Progress', color: '#3b82f6' }
                    ];
                    setAvailableStates(mockStates);
                    setFormData(prev => ({ ...prev, stateId: mockStates[0]._id }));
                }
            }
        };
        fetchStates();
    }, [formData.projectId]);

    // 4. Buscar Ciclos quando o Projeto mudar
    useEffect(() => {
        const fetchCycles = async () => {
            if (formData.projectId) {
                try {
                    // Usamos o serviço que criamos no passo anterior
                    const res = await cycleService.getAll(formData.projectId);
                    // Filtramos apenas ciclos ativos ou futuros para facilitar (opcional)
                    // const activeCycles = res.data.filter(c => new Date(c.endDate) >= new Date());
                    setAvailableCycles(res.data);
                } catch (error) {
                    console.error("Erro ao buscar ciclos", error);
                }
            }
        };
        fetchCycles();
    }, [formData.projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.projectId) return;

        setIsSubmitting(true);
        const success = await createIssue(formData);
        setIsSubmitting(false);

        if (success) {
            setFormData({
                title: '',
                description: '',
                priority: 'none',
                projectId: projects[0]?._id || '',
                stateId: '',
                assignees: [],
                cycleId: ''
            });
            closeIssueModal();
        }
    };

    if (!isIssueModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-slate-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wide">
                            Novo Item
                        </span>
                        <span className="text-slate-300">/</span>
                        <select
                            className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors"
                            value={formData.projectId}
                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        >
                            {projects.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.name} ({p.identifier})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={closeIssueModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="create-issue-form" onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            placeholder="Título da Issue"
                            className="w-full text-xl font-semibold placeholder:text-slate-300 border-none outline-none focus:ring-0 p-0"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            autoFocus
                        />

                        <RichTextEditor
                            value={formData.description}
                            onChange={(html) => setFormData({ ...formData, description: html })}
                            placeholder="Adicione uma descrição..."
                        />

                        {/* Barra de Propriedades (Grid) */}
                        <div className="grid grid-cols-3 gap-4 pt-2">
                            {/* Seletor de Estado */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Estado</label>
                                <div className="relative">
                                    <select
                                        className="w-full text-sm border border-slate-200 rounded-md px-2 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                                        value={formData.stateId}
                                        onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                                    >
                                        {availableStates.map(state => (
                                            <option key={state._id} value={state._id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-2.5 pointer-events-none">
                                        <Circle size={10} className="text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Seletor de Prioridade */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Prioridade</label>
                                <select
                                    className="w-full text-sm border border-slate-200 rounded-md px-2 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="none">Sem Prioridade</option>
                                    <option value="low">Baixa</option>
                                    <option value="medium">Média</option>
                                    <option value="high">Alta</option>
                                    <option value="urgent">Urgente</option>
                                </select>
                            </div>

                            {/* Seletor de Assignee */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Responsável</label>
                                <div className="relative">
                                    <select
                                        className="w-full text-sm border border-slate-200 rounded-md px-2 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData({ ...formData, assignees: val ? [val] : [] });
                                        }}
                                    >
                                        <option value="">Ninguém</option>
                                        {availableMembers.map(member => (
                                            <option key={member.user._id} value={member.user._id}>
                                                {member.user.name}
                                            </option>
                                        ))}
                                    </select>
                                    <User size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Seletor de Ciclo */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                    Ciclo
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full text-sm border border-slate-200 rounded-md px-2 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white pl-8"
                                        value={formData.cycleId}
                                        onChange={(e) => setFormData({ ...formData, cycleId: e.target.value })}
                                    >
                                        <option value="">Sem Ciclo</option>
                                        {availableCycles.map(cycle => (
                                            <option key={cycle._id} value={cycle._id}>
                                                {cycle.name}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Ícone posicionado à esquerda para dar estilo visual */}
                                    <Repeat size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-xl">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">Enter</span> para criar
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={closeIssueModal}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="create-issue-form"
                            disabled={isSubmitting || !formData.title}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>Criando...</>
                            ) : (
                                <>Criar Issue</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalIssueModal;

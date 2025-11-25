import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Drawer from '../ui/Drawer';
import RichTextEditor from '../ui/RichTextEditor'; // Reusar nosso editor
import api from '../../services/api'; // Chamada direta para simplificar
import {
    Calendar,
    User,
    MessageSquare,
    Activity,
    Send,
    CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const IssueDetailsDrawer = ({ issueId, isOpen, onClose, projectIdentifier }) => {
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'activity'

    // 1. Buscar Detalhes da Issue (dados frescos)
    const { data: issue, isLoading } = useQuery({
        queryKey: ['issue', issueId],
        queryFn: async () => {
            if (!issueId) return null;
            const res = await api.get(`/issues/${issueId}`); // Assumindo rota getById
            return res.data.data; // Ajuste conforme retorno do seu backend
        },
        enabled: !!issueId && isOpen
    });

    // 2. Buscar Comentários
    const { data: comments } = useQuery({
        queryKey: ['comments', issueId],
        queryFn: async () => {
            if (!issueId) return [];
            const res = await api.get(`/issues/${issueId}/comments`); // Precisamos criar essa rota GET no backend se não houver
            return res.data.data || [];
        },
        enabled: !!issueId && isOpen
    });

    // 3. Mutação para Adicionar Comentário
    const addCommentMutation = useMutation({
        mutationFn: async (text) => {
            return api.post(`/issues/${issueId}/comments`, { text });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['comments', issueId]);
            setCommentText('');
        }
    });

    const handleAddComment = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            addCommentMutation.mutate(commentText);
        }
    };

    if (!isOpen) return null;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={issue ? `${projectIdentifier}-${issue.sequenceId}` : 'Carregando...'}
        >
            {isLoading || !issue ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="space-y-8">

                    {/* Título e Descrição */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                            {issue.title}
                        </h1>
                        <div
                            className="prose prose-sm max-w-none text-slate-600"
                            dangerouslySetInnerHTML={{ __html: issue.description || '<p class="italic text-slate-400">Sem descrição fornecida.</p>' }}
                        />
                    </div>

                    {/* Propriedades (Grid Lateral estilo Plane) */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-xs font-medium text-slate-400 mb-1 uppercase">Estado</span>
                            <div className="flex items-center gap-2 font-medium text-slate-700">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: issue.state?.color || '#ccc' }} />
                                {issue.state?.name}
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-slate-400 mb-1 uppercase">Prioridade</span>
                            <div className="capitalize font-medium text-slate-700">
                                {issue.priority}
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-slate-400 mb-1 uppercase">Responsáveis</span>
                            <div className="flex -space-x-2 pt-1">
                                {issue.assignees?.length > 0 ? issue.assignees.map(u => (
                                    <div key={u._id} title={u.name} className="w-6 h-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                                        {u.name[0]}
                                    </div>
                                )) : <span className="text-slate-400 text-xs">Ninguém</span>}
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-slate-400 mb-1 uppercase">Data de Entrega</span>
                            <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                <Calendar size={14} className="text-slate-400" />
                                {issue.dueDate ? format(new Date(issue.dueDate), "dd MMM", { locale: ptBR }) : '-'}
                            </div>
                        </div>
                    </div>

                    {/* Abas: Comentários vs Atividade */}
                    <div>
                        <div className="flex items-center gap-6 border-b border-slate-200 mb-4">
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`pb-2 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <MessageSquare size={14} /> Comentários
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`pb-2 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Activity size={14} /> Histórico
                            </button>
                        </div>

                        {/* Área de Comentários */}
                        {activeTab === 'comments' && (
                            <div className="space-y-6">
                                {/* Lista */}
                                <div className="space-y-4">
                                    {comments && comments.length > 0 ? comments.map((comment, idx) => (
                                        <div key={idx} className="flex gap-3 group">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-1">
                                                {comment.author?.name?.[0] || '?'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-slate-800">{comment.author?.name}</span>
                                                    <span className="text-xs text-slate-400">{format(new Date(comment.createdAt), "dd MMM 'às' HH:mm", { locale: ptBR })}</span>
                                                </div>
                                                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md rounded-tl-none">
                                                    {comment.text}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6 text-slate-400 text-sm italic">
                                            Nenhum comentário ainda.
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <form onSubmit={handleAddComment} className="relative">
                                    <textarea
                                        className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px] pr-10 resize-none"
                                        placeholder="Deixe um comentário..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!commentText.trim() || addCommentMutation.isPending}
                                        className="absolute bottom-3 right-3 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={14} />
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Área de Atividade (Placeholder para MVP) */}
                        {activeTab === 'activity' && (
                            <div className="space-y-4 py-2 relative before:absolute before:top-0 before:bottom-0 before:left-[19px] before:w-[2px] before:bg-slate-100">
                                <div className="relative pl-8 py-1">
                                    <div className="absolute left-3 top-2 w-4 h-4 bg-slate-200 rounded-full border-2 border-white"></div>
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold text-slate-700">Você</span> criou esta issue.
                                    </p>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">
                                        {format(new Date(issue.createdAt), "dd MMM, yyyy", { locale: ptBR })}
                                    </span>
                                </div>
                                {/* Aqui mapearíamos o log real do backend */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default IssueDetailsDrawer;

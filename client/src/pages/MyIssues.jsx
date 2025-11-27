import { useState, useEffect } from 'react';
import { CheckCircle2, Filter } from 'lucide-react';
import api from '@/services/api';
import IssueListRow from '@/components/list/IssueListRow';

const MyIssues = () => {
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyIssues = async () => {
            try {
                const res = await api.get('/users/me/issues');
                setIssues(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyIssues();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-slate-500">Carregando suas tarefas...</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-indigo-50 rounded text-indigo-600">
                        <CheckCircle2 size={18} />
                    </div>
                    <h1 className="font-semibold text-slate-800">Minhas Issues</h1>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-2">
                        {issues.length}
                    </span>
                </div>
                <button className="text-xs text-slate-600 flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                    <Filter size={14} /> Filtros
                </button>
            </header>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
                {issues.length > 0 ? (
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-[120px_1fr_120px_100px_140px] gap-4 py-2 px-4 border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                            <div>Projeto / ID</div>
                            <div>Título</div>
                            <div>Status</div>
                            <div>Prioridade</div>
                            <div className="text-right">Responsável</div>
                        </div>
                        <div>
                            {issues.map(issue => {
                                const identifier = issue.project?.identifier || 'UNK';
                                return (
                                    <IssueListRow
                                        key={issue._id}
                                        issue={issue}
                                        projectIdentifier={identifier}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                        <p>Você não tem nenhuma issue atribuída.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyIssues;

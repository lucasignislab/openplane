import IssueListRow from './IssueListRow';
import { Layers } from 'lucide-react';

const ListView = ({ issues, projectIdentifier }) => {

    // Agrupamento opcional (podemos evoluir isso depois)
    // Por enquanto, lista plana simples

    if (issues.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <Layers size={48} className="mb-4 opacity-20" />
                <p>Nenhuma issue encontrada neste projeto.</p>
                <p className="text-xs mt-1">Crie uma nova issue para começar.</p>
            </div>
        );
    }

    return (
        <div className="min-w-[800px]">
            {/* Header da Tabela */}
            <div className="grid grid-cols-[80px_1fr_120px_100px_140px] gap-4 py-2 px-4 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                <div>ID</div>
                <div>Título</div>
                <div>Status</div>
                <div>Prioridade</div>
                <div className="text-right">Responsável</div>
            </div>

            {/* Linhas */}
            <div className="bg-white">
                {issues.map(issue => (
                    <IssueListRow
                        key={issue._id}
                        issue={issue}
                        projectIdentifier={projectIdentifier}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListView;

import {
    AlertOctagon,
    ArrowUpCircle,
    Circle,
    Signal,
    Calendar
} from 'lucide-react';

// Reutilizando a lógica de ícones (idealmente extrair para um util)
const getPriorityIcon = (priority) => {
    switch (priority) {
        case 'urgent': return <AlertOctagon size={14} className="text-red-500" />;
        case 'high': return <Signal size={14} className="text-orange-500" />;
        case 'medium': return <ArrowUpCircle size={14} className="text-blue-500" />;
        case 'low': return <Circle size={14} className="text-[#858699]" />;
        default: return <Circle size={14} className="text-[#5F6072]" />;
    }
};

const IssueListRow = ({ issue, projectIdentifier }) => {
    const shortId = `${projectIdentifier}-${issue.sequenceId}`;

    return (
        <div className="group grid grid-cols-[80px_1fr_120px_100px_140px] gap-4 py-2.5 px-4 border-b border-[#26272F] hover:bg-[#1E1F25] items-center transition-colors text-sm">

            {/* Coluna 1: ID */}
            <div className="font-mono text-xs text-[#858699] font-medium">
                {shortId}
            </div>

            {/* Coluna 2: Título */}
            <div className="font-medium text-[#E0E1EC] truncate pr-4">
                {issue.title}
            </div>

            {/* Coluna 3: Estado */}
            <div className="flex items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-[#26272F] bg-[#1E1F25] shadow-sm">
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: issue.state?.color || '#ccc' }}
                    />
                    <span className="text-xs text-[#E0E1EC] whitespace-nowrap truncate max-w-[80px]">
                        {issue.state?.name}
                    </span>
                </div>
            </div>

            {/* Coluna 4: Prioridade */}
            <div className="flex items-center gap-2 text-[#858699]">
                {getPriorityIcon(issue.priority)}
                <span className="text-xs capitalize">{issue.priority}</span>
            </div>

            {/* Coluna 5: Assignees */}
            <div className="flex justify-end">
                {issue.assignees && issue.assignees.length > 0 ? (
                    <div className="flex -space-x-2">
                        {issue.assignees.map((u, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-[#2C2D3C] border-2 border-[#151516] flex items-center justify-center text-[9px] font-bold text-[#E0E1EC]">
                                {u.name?.[0]}
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-[#5F6072] italic">--</span>
                )}
            </div>
        </div>
    );
};

export default IssueListRow;

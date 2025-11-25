import { Draggable } from '@hello-pangea/dnd';
import {
    AlertCircle,
    AlertOctagon,
    ArrowUpCircle,
    CheckCircle2,
    Circle,
    Signal,
    Calendar,
    MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Helper de Prioridade (Ícone + Cor)
const getPriorityDetails = (priority) => {
    switch (priority) {
        case 'urgent':
            return { icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-50' };
        case 'high':
            return { icon: Signal, color: 'text-orange-500', bg: 'bg-orange-50' };
        case 'medium':
            return { icon: ArrowUpCircle, color: 'text-blue-500', bg: 'bg-blue-50' };
        case 'low':
            return { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-50' };
        default:
            return { icon: Circle, color: 'text-slate-300', bg: 'bg-transparent' };
    }
};

const IssueCard = ({ issue, index, projectIdentifier, onIssueClick }) => {
    const shortId = `${projectIdentifier}-${issue.sequenceId}`;
    const priority = getPriorityDetails(issue.priority);
    const PriorityIcon = priority.icon;

    return (
        <Draggable draggableId={issue._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onIssueClick && onIssueClick(issue._id)}
                    className={`
            group relative bg-white p-3 rounded-[6px] border mb-2 transition-all select-none cursor-pointer
            ${snapshot.isDragging
                            ? 'shadow-lg ring-1 ring-slate-900/5 rotate-2 z-50 border-transparent'
                            : 'border-slate-200 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                        }
          `}
                    style={provided.draggableProps.style}
                >
                    {/* Título e ID */}
                    <div className="mb-2">
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="text-[13px] text-slate-800 font-medium leading-snug line-clamp-3">
                                {issue.title}
                            </h4>
                            {/* Menu de contexto (invisível por enquanto, aparece no hover) */}
                            {/* <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity">
                                <MoreHorizontal size={14} />
                            </button> */}
                        </div>
                    </div>

                    {/* Rodapé: Metadados */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            {/* ID do Projeto */}
                            <span className="text-[10px] font-mono text-slate-500 font-medium uppercase tracking-tight">
                                {shortId}
                            </span>

                            {/* Prioridade */}
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border border-transparent ${priority.bg}`}>
                                <PriorityIcon size={10} className={priority.color} />
                                <span className={`text-[9px] font-semibold capitalize ${priority.color.replace('text-', 'text-opacity-80 ')}`}>
                                    {issue.priority}
                                </span>
                            </div>
                        </div>

                        {/* Assignees & Date */}
                        <div className="flex items-center gap-2">
                            {issue.dueDate && (
                                <div className={`flex items-center gap-1 text-[10px] ${new Date(issue.dueDate) < new Date() ? 'text-red-600' : 'text-slate-400'
                                    }`}>
                                    <Calendar size={10} />
                                    <span>{format(new Date(issue.dueDate), 'dd MMM', { locale: ptBR })}</span>
                                </div>
                            )}

                            {issue.assignees && issue.assignees.length > 0 && (
                                <div className="flex -space-x-1.5">
                                    {issue.assignees.map((user, i) => (
                                        <div
                                            key={user._id || i}
                                            title={user.name}
                                            className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden ring-1 ring-white"
                                        >
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default IssueCard;

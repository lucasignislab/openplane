import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cycleService from '@/services/cycleService';
import api from '@/services/api'; // Para buscar states
import BoardColumn from '@/components/board/BoardColumn';
import { ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { DragDropContext } from '@hello-pangea/dnd';
import useIssueStore from '@/context/useIssueStore'; // Reutilizar update logic

const CycleDetails = () => {
    const { cycleId, projectId } = useParams(); // Precisamos garantir que a rota passe isso
    const navigate = useNavigate();
    const [cycle, setCycle] = useState(null);
    const [states, setStates] = useState([]);
    const { updateIssueStatus } = useIssueStore(); // Reutilizar a lógica de drag & drop

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Buscar detalhes do ciclo (que já traz as issues populadas no backend)
                const cycleRes = await cycleService.getById(cycleId);
                setCycle(cycleRes.data);

                // 2. Buscar estados do projeto para montar o Kanban
                // Nota: O backend precisa retornar projectId no cycle details para isso funcionar genericamente
                // Se cycleRes.data.projectId for populado (objeto), use ._id, senão use direto
                const pId = cycleRes.data.projectId._id || cycleRes.data.projectId;
                const statesRes = await api.get(`/projects/${pId}/states`);
                setStates(statesRes.data.data);
            } catch (error) {
                console.error("Erro ao carregar ciclo", error);
            }
        };
        loadData();
    }, [cycleId]);

    if (!cycle) return <div className="p-8">Carregando Ciclo...</div>;

    // Agrupar issues do ciclo por estado
    const issuesByState = cycle.issues.reduce((acc, issue) => {
        const stateId = issue.state?._id || issue.state;
        if (!acc[stateId]) acc[stateId] = [];
        acc[stateId].push(issue);
        return acc;
    }, {});

    const onDragEnd = (result) => {
        // Reutilizar a mesma lógica do KanbanBoard
        const { destination, draggableId } = result;
        if (!destination) return;

        // Atualização otimista local (opcional, mas recomendada)
        const newIssues = [...cycle.issues];
        const issueIndex = newIssues.findIndex(i => i._id === draggableId);
        if (issueIndex > -1) {
            // Precisamos saber o ID do estado de destino
            // O destination.droppableId é o ID do estado
            const newStateId = destination.droppableId;

            // Atualizar o estado da issue localmente para refletir na UI imediatamente
            // Precisamos encontrar o objeto estado completo se quisermos ser perfeitos, 
            // mas para o agrupamento só o ID basta se o reduce usar o ID.
            // O reduce usa: const stateId = issue.state?._id || issue.state;

            // Se issue.state for objeto, atualizamos o _id. Se for string, atualizamos a string.
            if (typeof newIssues[issueIndex].state === 'object') {
                newIssues[issueIndex].state._id = newStateId;
            } else {
                newIssues[issueIndex].state = newStateId;
            }

            setCycle(prev => ({ ...prev, issues: newIssues }));
        }

        updateIssueStatus(draggableId, destination.droppableId);
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 flex flex-col justify-center px-6 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-800">
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">{cycle.name}</h1>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${new Date() > new Date(cycle.endDate) ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
                        }`}>
                        {new Date() > new Date(cycle.endDate) ? 'Concluído' : 'Em Andamento'}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 ml-6">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(cycle.startDate), "d MMM", { locale: pt })} - {format(new Date(cycle.endDate), "d MMM", { locale: pt })}
                    </div>
                    <div>
                        {cycle.issues.length} Issues
                    </div>
                </div>
            </header>

            {/* Kanban do Ciclo */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-slate-50/30">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full gap-6">
                        {states.map(state => (
                            <BoardColumn
                                key={state._id}
                                state={state}
                                issues={issuesByState[state._id] || []}
                                projectIdentifier="CYC" // Aqui poderíamos buscar o identifier real do projeto
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default CycleDetails;

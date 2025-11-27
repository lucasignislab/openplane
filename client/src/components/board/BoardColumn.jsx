import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import IssueCard from './IssueCard';
import useUIStore from '@/context/useUIStore';

const BoardColumn = ({ state, issues, projectIdentifier, onIssueClick }) => {
    const { openIssueModal } = useUIStore();

    return (
        <div className="flex-shrink-0 w-[340px] flex flex-col h-full mr-4">
            {/* Header da Coluna */}
            <div className="flex items-center justify-between mb-3 px-1 group">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-700">
                        {state.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        {issues.length}
                    </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={openIssueModal}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* Área de Drop */}
            <Droppable droppableId={state._id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
              flex-1 rounded-lg transition-colors min-h-[150px] overflow-y-auto pb-10
              ${snapshot.isDraggingOver ? 'bg-slate-50/80 ring-1 ring-slate-200/50' : 'bg-transparent'}
            `}
                    >
                        {issues.map((issue, index) => (
                            <IssueCard
                                key={issue._id}
                                issue={issue}
                                index={index}
                                projectIdentifier={projectIdentifier}
                                onIssueClick={onIssueClick}
                            />
                        ))}
                        {provided.placeholder}

                        {/* Botão rápido de adicionar no fim da lista */}
                        <button
                            onClick={openIssueModal}
                            className="w-full py-2 text-xs font-medium text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-md mt-1 transition-all flex items-center justify-start gap-2 px-2 opacity-0 hover:opacity-100 group-hover/column:opacity-100"
                        >
                            <Plus size={14} /> Adicionar Issue
                        </button>
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default BoardColumn;

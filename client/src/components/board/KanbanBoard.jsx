import { DragDropContext } from '@hello-pangea/dnd';
import BoardColumn from './BoardColumn';
import useIssueStore from '../../context/useIssueStore';

const KanbanBoard = ({ projectIdentifier, onIssueClick }) => {
    const { issues, states, updateIssueStatus } = useIssueStore();

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        updateIssueStatus(draggableId, destination.droppableId);
    };

    // Agrupa as issues
    const issuesByState = issues.reduce((acc, issue) => {
        const stateId = issue.state?._id || issue.state;
        if (!acc[stateId]) acc[stateId] = [];
        acc[stateId].push(issue);
        return acc;
    }, {});

    // Ordenar issues dentro de cada coluna (opcional, por sequenceId ou ordem manual futura)
    // Por enquanto mantemos a ordem que vem da API

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full overflow-x-auto gap-6 pb-4 items-start">
                {states.map((state) => (
                    <BoardColumn
                        key={state._id}
                        state={state}
                        issues={issuesByState[state._id] || []}
                        projectIdentifier={projectIdentifier}
                        onIssueClick={onIssueClick}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;

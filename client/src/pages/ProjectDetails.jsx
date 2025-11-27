import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import useIssueStore from '@/context/useIssueStore';
import useUIStore from '@/context/useUIStore';
// import useProjectStore from '@/context/useProjectStore'; // Opcional se precisar de dados do projeto
import KanbanBoard from '@/components/board/KanbanBoard';
import ListView from '@/components/list/ListView'; // <--- Importar
import {
    Filter,
    Plus,
    Columns,
    List as ListIcon,
    Search,
    Repeat
} from 'lucide-react';

import IssueDetailsDrawer from '@/components/issue/IssueDetailsDrawer'; // <--- Importar

const ProjectDetails = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const { fetchBoardData, issues, isLoading } = useIssueStore();
    const { openIssueModal } = useUIStore();

    const [projectIdentifier, setProjectIdentifier] = useState('PROJ'); // Idealmente viria da API
    const [viewType, setViewType] = useState('kanban'); // 'kanban' | 'list'

    // Estado do Drawer
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleIssueClick = (issueId) => {
        setSelectedIssueId(issueId);
        setIsDrawerOpen(true);
    };

    useEffect(() => {
        if (projectId) {
            fetchBoardData(projectId);
            // Mock do Identifier (Substitua por chamada real ao projectService.getById se quiser)
            // setProjectIdentifier(...)
        }
    }, [projectId, fetchBoardData]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#151516]">
            {/* Header do Projeto */}
            <header className="h-14 border-b border-[#26272F] flex items-center justify-between px-6 bg-[#151516] shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-[#E0E1EC]">Issues</h1>
                    </div>

                    <div className="h-4 w-[1px] bg-[#26272F]"></div>

                    {/* View Switcher */}
                    <div className="flex bg-[#1E1F25] p-0.5 rounded-md border border-[#26272F]">
                        <button
                            onClick={() => setViewType('kanban')}
                            className={`p-1 rounded-sm transition-all ${viewType === 'kanban' ? 'bg-[#2C2D3C] shadow-sm text-[#E0E1EC]' : 'text-[#858699] hover:text-[#E0E1EC]'}`}
                            title="Kanban Board"
                        >
                            <Columns size={14} />
                        </button>
                        <button
                            onClick={() => setViewType('list')}
                            className={`p-1 rounded-sm transition-all ${viewType === 'list' ? 'bg-[#2C2D3C] shadow-sm text-[#E0E1EC]' : 'text-[#858699] hover:text-[#E0E1EC]'}`}
                            title="List View"
                        >
                            <ListIcon size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Barra de Busca Simplificada */}
                    <div className="relative hidden md:block">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858699]" />
                        <input
                            type="text"
                            placeholder="Filtrar..."
                            className="pl-8 pr-3 py-1.5 bg-[#1E1F25] border border-[#26272F] rounded-md text-xs text-[#E0E1EC] focus:outline-none focus:border-[#3F76FF] w-40 transition-all focus:w-60 placeholder-[#5F6072]"
                        />
                    </div>

                    <button className="text-xs text-[#858699] flex items-center gap-1.5 px-3 py-1.5 border border-[#26272F] rounded-md hover:bg-[#2C2D3C] hover:text-[#E0E1EC] transition-colors">
                        <Filter size={14} /> Filtros
                    </button>
                    <button
                        onClick={openIssueModal}
                        className="bg-[#3F76FF] hover:bg-[#3F76FF]/90 text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                        <Plus size={14} /> Nova Issue
                    </button>
                </div>
            </header>

            {/* Área de Conteúdo (Alterna entre Kanban e Lista) */}
            <div className="flex-1 overflow-hidden relative">
                {viewType === 'kanban' ? (
                    <div className="h-full overflow-x-auto overflow-y-hidden p-6">
                        <KanbanBoard
                            projectIdentifier={projectIdentifier}
                            onIssueClick={handleIssueClick}
                        />
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto overflow-x-auto">
                        <ListView
                            issues={issues}
                            projectIdentifier={projectIdentifier}
                        />
                    </div>
                )}
            </div>

            <IssueDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                issueId={selectedIssueId}
                projectIdentifier={projectIdentifier}
            />
        </div>
    );
};

export default ProjectDetails;

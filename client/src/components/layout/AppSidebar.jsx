import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
    Home,
    Inbox,
    User,
    Briefcase,
    MoreHorizontal,
    FileText,
    PlusCircle,
    Search,
    Layers,
    Disc,
    Grid as LayoutGrid, // Aliasing Grid as LayoutGrid for compatibility
    Files as Stack, // Aliasing Files or similar as Stack if Stack is missing, but let's try Stack first or use Layers. User said Stack = Views. Layers is already used. Let's use 'GalleryVerticalEnd' or similar if Stack is missing. Actually, let's try to import Stack. If it fails, I'll fix it. To be safe, I'll use 'GalleryVerticalEnd as Stack' or just 'Layers as Stack'. Let's use 'GalleryVerticalEnd' which looks like a stack.
    File,
    ChevronDown
} from 'lucide-react';
import useAuthStore from '@/context/authStore';
import useWorkspaceStore from '@/context/useWorkspaceStore';
import useProjectStore from '@/context/useProjectStore';
import useUIStore from '@/context/useUIStore';

const AppSidebar = () => {
    const location = useLocation();
    const { projectId } = useParams(); // Para saber qual projeto está ativo
    const { user } = useAuthStore();
    const {
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        fetchWorkspaces
    } = useWorkspaceStore();

    const { projects, fetchProjects } = useProjectStore();
    const { openIssueModal } = useUIStore();

    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        if (currentWorkspace) {
            fetchProjects(currentWorkspace._id);
        }
    }, [currentWorkspace]);

    const isActive = (path) => location.pathname.includes(path);

    // Helper para iniciais
    const getInitials = (name) => name ? name.substring(0, 1).toUpperCase() : '?';

    if (!currentWorkspace) return null;

    return (
        <aside className="w-[280px] h-screen flex flex-col bg-[#151516] text-[#858699] border-r border-[#26272F] select-none font-medium text-[13px]">

            {/* --- 1. HEADER (Workspace + User) --- */}
            <div className="px-4 py-3 flex items-center justify-between">
                {/* Workspace Selector */}
                <div className="relative flex-1 mr-2">
                    <button
                        onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                        className="flex items-center gap-2 hover:bg-[#2C2D3C] p-1 rounded transition-colors -ml-1"
                    >
                        <div className="w-5 h-5 rounded bg-[#3F76FF] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {getInitials(currentWorkspace.name)}
                        </div>
                        <span className="text-[#E0E1EC] font-medium truncate max-w-[140px]">
                            {currentWorkspace.name}
                        </span>
                        <ChevronDown size={12} className="text-[#858699]" />
                    </button>

                    {/* Dropdown Workspace */}
                    {isWorkspaceOpen && (
                        <div className="absolute top-full left-0 w-64 mt-1 bg-[#1E1F25] border border-[#26272F] rounded-lg shadow-xl z-50 py-1">
                            {workspaces.map(ws => (
                                <button
                                    key={ws._id}
                                    onClick={() => {
                                        setCurrentWorkspace(ws);
                                        setIsWorkspaceOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-[#E0E1EC] hover:bg-[#2C2D3C] text-xs"
                                >
                                    {ws.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Avatar */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] border border-[#26272F]">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="User" className="w-full h-full rounded-full" />
                    ) : (
                        getInitials(user?.name)
                    )}
                </div>
            </div>

            {/* --- 2. ACTION BAR (New Item + Search) --- */}
            <div className="px-3 pb-4 flex gap-2">
                <button
                    onClick={openIssueModal}
                    className="flex-1 flex items-center gap-2 px-3 py-1.5 border border-[#363741] rounded-[6px] text-[#E0E1EC] hover:bg-[#2C2D3C] transition-colors group"
                >
                    <PlusCircle size={16} className="text-[#858699] group-hover:text-[#E0E1EC]" />
                    <span>New work item</span>
                </button>
                <button className="p-1.5 border border-[#363741] rounded-[6px] text-[#858699] hover:text-[#E0E1EC] hover:bg-[#2C2D3C] transition-colors">
                    <Search size={16} />
                </button>
            </div>

            {/* --- SCROLLABLE AREA --- */}
            <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-hide">

                {/* SEÇÃO 3: MAIN NAV */}
                <div className="space-y-0.5">
                    <NavItem to="/dashboard" icon={Home} label="Home" active={isActive('/dashboard')} />
                    <NavItem to="/inbox" icon={Inbox} label="Inbox" active={isActive('/inbox')} />
                    <NavItem to="/my-issues" icon={User} label="Your work" active={isActive('/my-issues')} />
                </div>

                {/* SEÇÃO 4: WORKSPACE */}
                <div>
                    <div className="px-2 mb-1 text-xs font-semibold text-[#5F6072]">Workspace</div>
                    <div className="space-y-0.5">
                        <NavItem to="/projects" icon={Briefcase} label="Projects" active={isActive('/projects') && !projectId} />
                        <NavItem to="/settings" icon={MoreHorizontal} label="More" />
                    </div>
                </div>

                {/* SEÇÃO 5: FAVORITES */}
                <div>
                    <div className="px-2 mb-1 text-xs font-semibold text-[#5F6072]">Favorites</div>
                    <div className="space-y-0.5">
                        {/* Mock de favorito para ficar igual à imagem */}
                        <NavItem to="#" icon={FileText} label="Conteúdo Textual do S..." />
                    </div>
                </div>

                {/* SEÇÃO 6: PROJECTS LIST (Expandable) */}
                <div>
                    <div className="px-2 mb-1 text-xs font-semibold text-[#5F6072]">Projects</div>
                    <div className="space-y-1 mt-1">
                        {projects.map(project => {
                            const isProjectActive = location.pathname.includes(`/projects/${project._id}`);

                            return (
                                <div key={project._id}>
                                    <Link
                                        to={`/projects/${project._id}`}
                                        className={`
                      flex items-center gap-2 px-2 py-1.5 rounded-[6px] transition-colors
                      ${isProjectActive ? 'text-[#E0E1EC]' : 'hover:bg-[#2C2D3C] text-[#858699]'}
                    `}
                                    >
                                        <span className="text-base">{project.icon || '🖥️'}</span>
                                        <span className="truncate">{project.name}</span>
                                    </Link>

                                    {/* SUB-MENU DO PROJETO (Só aparece se ativo) */}
                                    {isProjectActive && (
                                        <div className="ml-2.5 pl-2 border-l border-[#2C2D3C] mt-1 space-y-0.5">
                                            <SubNavItem
                                                to={`/projects/${project._id}`}
                                                icon={Layers}
                                                label="Work items"
                                                active={location.pathname === `/projects/${project._id}`}
                                            />
                                            <SubNavItem
                                                to={`/projects/${project._id}/cycles`}
                                                icon={Disc}
                                                label="Cycles"
                                                active={location.pathname.includes('/cycles')}
                                            />
                                            <SubNavItem
                                                to={`/projects/${project._id}/modules`}
                                                icon={LayoutGrid}
                                                label="Modules"
                                                active={location.pathname.includes('/modules')}
                                            />
                                            <SubNavItem
                                                to={`/projects/${project._id}/views`}
                                                icon={Stack}
                                                label="Views"
                                                active={location.pathname.includes('/views')}
                                            />
                                            <SubNavItem
                                                to={`/projects/${project._id}/pages`}
                                                icon={File}
                                                label="Pages"
                                                active={location.pathname.includes('/pages')}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </aside>
    );
};

// Componente Principal de Item de Menu
const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`
      flex items-center gap-3 px-2 py-1.5 rounded-[6px] transition-colors
      ${active
                ? 'bg-[#2C2D3C] text-[#E0E1EC]'
                : 'text-[#858699] hover:bg-[#2C2D3C] hover:text-[#B5B6C9]'
            }
    `}
    >
        <Icon size={18} strokeWidth={2} />
        {label}
    </Link>
);

// Componente de Sub-item (Indentado para projetos)
const SubNavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`
      flex items-center gap-3 px-2 py-1.5 rounded-[6px] transition-colors text-[13px]
      ${active
                ? 'bg-[#2C2D3C] text-[#E0E1EC]'
                : 'text-[#858699] hover:bg-[#2C2D3C] hover:text-[#B5B6C9]'
            }
    `}
    >
        <Icon size={16} strokeWidth={2} />
        {label}
    </Link>
);

export default AppSidebar;

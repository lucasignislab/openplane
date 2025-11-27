import { useEffect, useState } from 'react';
import useAuthStore from '@/context/authStore';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Layout, Plus } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={20} />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState(null);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');

        // Buscar stats
        api.get('/users/me/dashboard')
            .then(res => setStats(res.data.data))
            .catch(console.error);
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    {greeting}, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-slate-500 mt-2">
                    Aqui está o resumo do seu trabalho hoje.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    label="Atribuídas a Mim"
                    value={stats?.overview?.assigned || 0}
                    icon={CheckCircle2}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    label="Criadas por Mim"
                    value={stats?.overview?.created || 0}
                    icon={Plus}
                    color="bg-orange-50 text-orange-600"
                />
                <StatCard
                    label="Projetos Ativos"
                    value={stats?.recentProjects?.length || 0}
                    icon={Layout}
                    color="bg-purple-50 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Projetos Recentes */}
                <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" /> Acessados Recentemente
                    </h3>
                    <div className="space-y-3">
                        {stats?.recentProjects?.length > 0 ? stats.recentProjects.map(project => (
                            <Link
                                key={project._id}
                                to={`/projects/${project._id}`}
                                className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group"
                            >
                                <div className="h-10 w-10 bg-slate-50 rounded flex items-center justify-center text-lg border border-slate-100">
                                    {project.icon || '📊'}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {project.name}
                                    </h4>
                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                        {project.identifier}
                                    </span>
                                </div>
                            </Link>
                        )) : (
                            <div className="p-6 border border-dashed border-slate-300 rounded-lg text-center text-slate-400 text-sm">
                                Nenhum projeto recente.
                            </div>
                        )}
                    </div>
                </div>

                {/* Widget de Issues (Mini List) */}
                <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-slate-400" /> Tarefas Prioritárias
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="p-4 text-center text-sm text-slate-500 italic">
                            Visualização rápida em breve...
                            <br />
                            <Link to="/my-issues" className="text-blue-600 hover:underline not-italic mt-2 block">
                                Ver todas as minhas tarefas &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

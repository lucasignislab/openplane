import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, Layout } from 'lucide-react';
import cycleService from '../services/cycleService';
import CreateCycleModal from '../components/cycles/CreateCycleModal';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const Cycles = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [cycles, setCycles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, current, upcoming, completed

    const fetchCycles = async () => {
        if (projectId) {
            const res = await cycleService.getAll(projectId);
            setCycles(res.data);
        }
    };

    useEffect(() => {
        fetchCycles();
    }, [projectId]);

    // Filtragem simples baseada na propriedade virtual 'status' que criámos no backend
    // Nota: Como o virtual é calculado no backend, certifique-se que o backend envia o status ou calculamos aqui.
    // Vamos calcular aqui para garantir reatividade imediata.
    const getStatus = (start, end) => {
        const now = new Date();
        const s = new Date(start);
        const e = new Date(end);
        if (now >= s && now <= e) return 'current';
        if (now < s) return 'upcoming';
        return 'completed';
    };

    const filteredCycles = cycles.filter(c => {
        if (activeTab === 'all') return true;
        return getStatus(c.startDate, c.endDate) === activeTab;
    });

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ciclos</h1>
                    <p className="text-sm text-slate-500">Planeie e acompanhe o trabalho em iterações temporais.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                    <Plus size={16} /> Novo Ciclo
                </button>
            </header>

            {/* Abas de Navegação */}
            <div className="flex border-b border-slate-200 mb-6">
                {['all', 'current', 'upcoming', 'completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab === 'all' ? 'Todos' : tab}
                    </button>
                ))}
            </div>

            {/* Grid de Ciclos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCycles.map(cycle => {
                    const status = getStatus(cycle.startDate, cycle.endDate);
                    return (
                        <Link
                            key={cycle._id}
                            to={`/cycles/${cycle._id}`}
                            className="block"
                        >
                            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden h-full">
                                {status === 'current' && <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">ATUAL</div>}

                                <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600">{cycle.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                    <Calendar size={12} />
                                    <span>{format(new Date(cycle.startDate), "d MMM", { locale: pt })} - {format(new Date(cycle.endDate), "d MMM", { locale: pt })}</span>
                                </div>

                                {/* Barra de Progresso Fake (Implementar lógica real depois) */}
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>0% Concluído</span>
                                    <span>0 Issues</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <CreateCycleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={projectId}
                onSuccess={fetchCycles}
            />
        </div>
    );
};

export default Cycles;

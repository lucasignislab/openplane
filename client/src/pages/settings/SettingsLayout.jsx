import { useState } from 'react';
import { User, Settings as SettingsIcon, Users } from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import MembersSettings from './MembersSettings';
import ProfileSettings from './ProfileSettings';

const SettingsLayout = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'Geral', icon: SettingsIcon, component: GeneralSettings },
        { id: 'members', label: 'Membros', icon: Users, component: MembersSettings },
        { id: 'profile', label: 'Meu Perfil', icon: User, component: ProfileSettings },
    ];

    const ActiveComponent = tabs.find(t => t.id === activeTab).component;

    return (
        <div className="flex h-full bg-white">
            {/* Sidebar de Configurações */}
            <div className="w-64 border-r border-slate-200 p-6 flex flex-col gap-1 shrink-0">
                <h1 className="text-xl font-bold text-slate-900 mb-6">Configurações</h1>

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    Workspace
                </div>
                {tabs.slice(0, 2).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-6">
                    Conta
                </div>
                {tabs.slice(2).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Área de Conteúdo */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto">
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;

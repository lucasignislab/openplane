import { useState } from 'react';
import { Trash2, Mail, Plus, Shield, User } from 'lucide-react';
import useWorkspaceStore from '../../context/useWorkspaceStore';
import workspaceService from '../../services/workspaceService';
import useAuthStore from '../../context/useAuthStore';

const MembersSettings = () => {
    const { currentWorkspace, fetchWorkspaces } = useWorkspaceStore();
    const { user: currentUser } = useAuthStore();

    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [error, setError] = useState('');

    // Helper para pegar a lista atualizada (no MVP, ela vem dentro do objeto workspace)
    // Em app real, faríamos um fetchMembers separado.
    const members = currentWorkspace?.members || [];

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setIsInviting(true);
        setError('');

        try {
            await workspaceService.inviteMember(currentWorkspace._id, inviteEmail, 'member');
            setInviteEmail('');
            fetchWorkspaces(); // Recarrega para atualizar a lista
            // Mostrar Toast de sucesso aqui
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao convidar.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleRemove = async (userId) => {
        if (!confirm('Tem certeza que deseja remover este membro?')) return;

        try {
            await workspaceService.removeMember(currentWorkspace._id, userId);
            fetchWorkspaces();
        } catch (err) {
            alert('Erro ao remover membro.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Membros</h2>
                    <p className="text-sm text-slate-500">Gerencie quem tem acesso a este workspace.</p>
                </div>
            </div>

            {/* Card de Convite */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Convidar novo membro</h3>
                <form onSubmit={handleInvite} className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="email"
                            placeholder="email@exemplo.com (Deve ter conta criada)"
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isInviting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus size={16} /> Convidar
                    </button>
                </form>
                {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            </div>

            {/* Lista de Membros */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_100px] gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div>Usuário</div>
                    <div>Papel</div>
                    <div className="text-right">Ações</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {members.map((member) => {
                        // O populate pode variar dependendo de como o Mongoose retornou
                        // Às vezes vem member.user (objeto) ou member.user (ID).
                        // O ideal é garantir o populate no backend. Vamos assumir que está populado.
                        const userData = member.user;

                        // Fallback para evitar crash se dados estiverem incompletos
                        if (!userData || typeof userData === 'string') return null;

                        return (
                            <div key={userData._id} className="grid grid-cols-[1fr_100px_100px] gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        {userData.name?.[0]}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">
                                            {userData.name} {userData._id === currentUser.id && '(Você)'}
                                        </div>
                                        <div className="text-xs text-slate-500">{userData.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-600 capitalize bg-slate-100 px-2 py-1 rounded-full w-fit">
                                    {member.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                    {member.role}
                                </div>

                                <div className="text-right">
                                    {member.role !== 'admin' && (
                                        <button
                                            onClick={() => handleRemove(userData._id)}
                                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                            title="Remover membro"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MembersSettings;

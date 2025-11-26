import useAuthStore from '../../context/useAuthStore';

const ProfileSettings = () => {
    const { user } = useAuthStore();

    return (
        <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Meu Perfil</h2>
            <p className="text-sm text-slate-500 mb-6">Gerencie suas informações pessoais.</p>

            <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.[0]}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-900">{user?.name}</h3>
                        <p className="text-slate-500 text-sm">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            value={user?.name || ''}
                            disabled
                            className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 mt-1">Edição de perfil em breve.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;


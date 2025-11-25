import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../context/authStore';

function Welcome() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Redirecionar usuários autenticados para o dashboard
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-slate-200">
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                        OP
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
                    Bem-vindo ao OpenPlane
                </h1>
                <p className="text-center text-slate-500 mb-8">
                    O clone open-source do Plane.so rodando no Google Antigravity.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-md border border-slate-300 transition-colors"
                    >
                        Criar Conta
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                    Frontend v1.0 • Backend Connected (Check Console)
                </div>
            </div>
        </div>
    );
}

export default Welcome;

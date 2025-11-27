import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuthStore from '@/context/authStore';

// Schema de validação
const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

function Login() {
    const navigate = useNavigate();
    const { login, loading, error, clearError } = useAuthStore();
    const [submitError, setSubmitError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setSubmitError('');
        clearError();

        try {
            await login(data.email, data.password);
            // Redirecionar para dashboard após login
            navigate('/dashboard');
        } catch (err) {
            setSubmitError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-slate-200">
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                        OP
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
                    Login
                </h1>
                <p className="text-center text-slate-500 mb-8">
                    Entre com sua conta do OpenPlane
                </p>

                {(submitError || error) && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{submitError || error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="seu@email.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Criar conta
                        </Link>
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
                        ← Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

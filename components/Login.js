import React from 'react';
import supabase from '../utils/supabaseClient';

export function Login({ onLogin }) {
    const [credentials, setCredentials] = React.useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRecovering, setIsRecovering] = React.useState(false);
    const [recoveryEmail, setRecoveryEmail] = React.useState('');
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });

    React.useEffect(() => {
        // Verifica se já existe uma sessão ativa
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session) {
                onLogin(session.user);
            }
        };
        checkSession();

        // Carrega credenciais salvas
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setCredentials(prev => ({
                ...prev,
                email: savedEmail,
                rememberMe: true
            }));
        }
    }, [onLogin]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (!credentials.email || !credentials.password) {
                throw new Error('Por favor, preencha todos os campos');
            }

            const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            });

            if (signInError) throw signInError;

            if (credentials.rememberMe) {
                localStorage.setItem('rememberedEmail', credentials.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            setShowMessage({
                show: true,
                title: 'Sucesso!',
                message: 'Login realizado com sucesso',
                type: 'success'
            });

            onLogin(user);
        } catch (err) {
            console.error('Erro no login:', err);
            setError(err.message === 'Invalid login credentials'
                ? 'Email ou senha incorretos'
                : err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePasswordRecovery(e) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
                redirectTo: window.location.origin + '/reset-password'
            });

            if (error) throw error;

            setShowMessage({
                show: true,
                title: 'Email enviado!',
                message: 'Verifique sua caixa de entrada para redefinir sua senha',
                type: 'success'
            });
            setIsRecovering(false);
        } catch (err) {
            console.error('Erro na recuperação de senha:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isRecovering ? 'Recuperar Senha' : 'Login'}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {showMessage.show && (
                    <div className={`bg-${showMessage.type === 'success' ? 'green' : 'red'}-100 border border-${showMessage.type === 'success' ? 'green' : 'red'}-400 text-${showMessage.type === 'success' ? 'green' : 'red'}-700 px-4 py-3 rounded relative`} role="alert">
                        <strong className="font-bold">{showMessage.title}</strong>
                        <span className="block sm:inline"> {showMessage.message}</span>
                    </div>
                )}

                {isRecovering ? (
                    <form className="mt-8 space-y-6" onSubmit={handlePasswordRecovery}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="recovery-email" className="sr-only">Email</label>
                                <input
                                    id="recovery-email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => setIsRecovering(false)}
                                disabled={isLoading}
                            >
                                Voltar ao login
                            </button>
                            <button
                                type="submit"
                                className="group relative w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enviando...' : 'Enviar email de recuperação'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Senha</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Senha"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    checked={credentials.rememberMe}
                                    onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
                                    disabled={isLoading}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Lembrar email
                                </label>
                            </div>

                            <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => setIsRecovering(true)}
                                disabled={isLoading}
                            >
                                Esqueceu a senha?
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

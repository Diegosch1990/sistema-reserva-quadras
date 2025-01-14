import supabase from '../utils/supabaseClient';

function Login({ onLogin }) {
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
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedEmail && savedPassword) {
            setCredentials(prev => ({
                ...prev,
                email: savedEmail,
                password: savedPassword,
                rememberMe: true
            }));
        }
    }, []);

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            setError('');
            setIsLoading(true);

            if (!credentials.email || !credentials.password) {
                setError('Por favor, preencha todos os campos');
                return;
            }

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            });

            if (signInError) {
                throw signInError;
            }

            if (credentials.rememberMe) {
                localStorage.setItem('rememberedEmail', credentials.email);
                localStorage.setItem('rememberedPassword', credentials.password);
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }

            localStorage.setItem('isAuthenticated', 'true');
            onLogin();

        } catch (error) {
            console.error('Erro no login:', error);
            setError('Email ou senha inválidos');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRecoverPassword(e) {
        try {
            e.preventDefault();
            if (!recoveryEmail) {
                setError('Por favor, insira seu email');
                return;
            }

            setIsLoading(true);
            
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                recoveryEmail,
                {
                    redirectTo: window.location.origin + '/reset-password'
                }
            );

            if (resetError) {
                throw resetError;
            }

            setShowMessage({
                show: true,
                title: 'Email Enviado',
                message: 'Instruções para recuperação de senha foram enviadas para seu email.',
                type: 'success'
            });
            setIsRecovering(false);

        } catch (error) {
            console.error('Erro na recuperação de senha:', error);
            setError('Erro ao enviar email de recuperação');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-300"></div>
                </div>

                <div className="relative">
                    {!isRecovering ? (
                        <>
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Bem-vindo
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Sistema de Agendamento de Quadra
                            </p>
                            <div className="mt-2 text-center text-xs text-gray-500">
                                Primeiro acesso use: admin@admin.com / admin123
                            </div>

                            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="mt-1 relative">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                value={credentials.email}
                                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Senha
                                        </label>
                                        <div className="mt-1 relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                value={credentials.password}
                                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                checked={credentials.rememberMe}
                                                onChange={(e) => setCredentials({...credentials, rememberMe: e.target.checked})}
                                            />
                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                                Lembrar-me
                                            </label>
                                        </div>

                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                            onClick={() => setIsRecovering(true)}
                                        >
                                            Esqueceu sua senha?
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                            isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {isLoading ? 'Entrando...' : 'Entrar'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div>
                                <h2 className="text-center text-2xl font-bold text-gray-900">
                                    Recuperar Senha
                                </h2>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Digite seu email para receber instruções de recuperação
                                </p>
                            </div>

                            <form className="mt-8 space-y-6" onSubmit={handleRecoverPassword}>
                                <div>
                                    <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="recovery-email"
                                        name="recovery-email"
                                        type="email"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={recoveryEmail}
                                        onChange={(e) => setRecoveryEmail(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                )}

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={() => setIsRecovering(false)}
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {isLoading ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <MessageModal
                isOpen={showMessage.show}
                onClose={() => setShowMessage({ show: false, title: '', message: '', type: 'success' })}
                title={showMessage.title}
                message={showMessage.message}
                type={showMessage.type}
            />
        </div>
    );
}

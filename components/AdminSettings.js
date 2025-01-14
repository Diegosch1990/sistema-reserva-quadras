function AdminSettings() {
    const [adminData, setAdminData] = React.useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });

    React.useEffect(() => {
        loadAdminData();
    }, []);

    async function loadAdminData() {
        try {
            const response = await trickleListObjects('admin_settings', 1, true);
            if (response.items && response.items.length > 0) {
                setAdminData(prev => ({
                    ...prev,
                    email: response.items[0].objectData.email
                }));
            }
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao carregar dados do administrador',
                type: 'error'
            });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (adminData.newPassword !== adminData.confirmPassword) {
                setShowMessage({
                    show: true,
                    title: 'Erro',
                    message: 'As senhas não coincidem',
                    type: 'error'
                });
                return;
            }

            const response = await trickleListObjects('admin_settings', 1, true);
            if (response.items && response.items.length > 0) {
                const currentAdmin = response.items[0];
                if (currentAdmin.objectData.password !== adminData.currentPassword) {
                    setShowMessage({
                        show: true,
                        title: 'Erro',
                        message: 'Senha atual incorreta',
                        type: 'error'
                    });
                    return;
                }

                await trickleUpdateObject('admin_settings', currentAdmin.objectId, {
                    email: adminData.email,
                    password: adminData.newPassword
                });

                setShowMessage({
                    show: true,
                    title: 'Sucesso',
                    message: 'Dados do administrador atualizados com sucesso',
                    type: 'success'
                });

                setAdminData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao atualizar dados do administrador',
                type: 'error'
            });
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Configurações do Administrador</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={adminData.email}
                        onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Senha Atual
                    </label>
                    <input
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={adminData.currentPassword}
                        onChange={(e) => setAdminData({...adminData, currentPassword: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nova Senha
                    </label>
                    <input
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={adminData.newPassword}
                        onChange={(e) => setAdminData({...adminData, newPassword: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Confirmar Nova Senha
                    </label>
                    <input
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={adminData.confirmPassword}
                        onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Atualizar
                    </button>
                </div>
            </form>

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

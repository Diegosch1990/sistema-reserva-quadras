function AdminSettings({ onSuccess, onError }) {
    const [adminData, setAdminData] = React.useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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
            onError('Erro', 'Erro ao carregar dados do administrador');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (adminData.newPassword !== adminData.confirmPassword) {
                onError('Erro', 'As senhas não coincidem');
                return;
            }

            const response = await trickleListObjects('admin_settings', 1, true);
            if (response.items && response.items.length > 0) {
                const currentAdmin = response.items[0];
                if (currentAdmin.objectData.password !== adminData.currentPassword) {
                    onError('Erro', 'Senha atual incorreta');
                    return;
                }

                await trickleUpdateObject('admin_settings', currentAdmin.objectId, {
                    email: adminData.email,
                    password: adminData.newPassword
                });

                onSuccess('Sucesso', 'Dados do administrador atualizados com sucesso');
                setAdminData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao atualizar dados do administrador');
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Configurações do Administrador</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={adminData.email}
                        onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                    <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={adminData.currentPassword}
                        onChange={(e) => setAdminData({...adminData, currentPassword: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={adminData.newPassword}
                        onChange={(e) => setAdminData({...adminData, newPassword: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                    <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
        </div>
    );
}

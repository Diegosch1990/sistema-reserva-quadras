function BusinessSettings({ onSuccess, onError }) {
    const [businessData, setBusinessData] = React.useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        openingHours: '',
        logo: ''
    });
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });

    React.useEffect(() => {
        loadBusinessData();
    }, []);

    async function loadBusinessData() {
        try {
            const response = await trickleListObjects('business_settings', 1, true);
            if (response.items && response.items.length > 0) {
                setBusinessData(response.items[0].objectData);
            }
        } catch (error) {
            reportError(error);
            handleError('Erro', 'Erro ao carregar dados do estabelecimento');
        }
    }

    async function handleLogoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBusinessData(prev => ({
                        ...prev,
                        logo: reader.result
                    }));
                };
                reader.readAsDataURL(file);
            } catch (error) {
                reportError(error);
                handleError('Erro', 'Erro ao carregar logo');
            }
        }
    }

    const handleSuccess = (title, message) => {
        if (onSuccess) {
            onSuccess(title, message);
        } else {
            setShowMessage({
                show: true,
                title,
                message,
                type: 'success'
            });
        }
    };

    const handleError = (title, message) => {
        if (onError) {
            onError(title, message);
        } else {
            setShowMessage({
                show: true,
                title,
                message,
                type: 'error'
            });
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await trickleListObjects('business_settings', 1, true);
            if (response.items && response.items.length > 0) {
                await trickleUpdateObject('business_settings', response.items[0].objectId, businessData);
            } else {
                await trickleCreateObject('business_settings', businessData);
            }
            handleSuccess('Sucesso', 'Dados do estabelecimento atualizados com sucesso!');
        } catch (error) {
            reportError(error);
            handleError('Erro', 'Erro ao atualizar dados do estabelecimento');
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Configurações do Estabelecimento</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Logomarca</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="form-input"
                        />
                        {businessData.logo && (
                            <img 
                                src={businessData.logo} 
                                alt="Logo preview" 
                                className="logo-preview"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Estabelecimento</label>
                    <input
                        type="text"
                        className="form-input"
                        value={businessData.name}
                        onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input
                        type="text"
                        className="form-input"
                        value={businessData.address}
                        onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                        type="text"
                        className="form-input"
                        value={businessData.phone}
                        onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        value={businessData.email}
                        onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Horário de Funcionamento</label>
                    <textarea
                        className="form-textarea"
                        value={businessData.openingHours}
                        onChange={(e) => setBusinessData({ ...businessData, openingHours: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                    >
                        Salvar Alterações
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

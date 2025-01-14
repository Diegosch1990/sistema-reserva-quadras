function CourtManagement({ onSuccess, onError }) {
    const [courts, setCourts] = React.useState([]);
    const [newCourt, setNewCourt] = React.useState({ name: '', price: '' });
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });

    React.useEffect(() => {
        loadCourts();
    }, []);

    async function loadCourts() {
        try {
            const response = await trickleListObjects('court', 100, true);
            setCourts(response.items || []);
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao carregar quadras');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!newCourt.name || !newCourt.price) {
                onError('Erro', 'Por favor, preencha todos os campos');
                return;
            }

            await trickleCreateObject('court', newCourt);
            await loadCourts();
            setNewCourt({ name: '', price: '' });
            onSuccess('Sucesso', 'Quadra adicionada com sucesso!');
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao adicionar quadra');
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Gerenciamento de Quadras</h2>
            
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium mb-4">Adicionar Nova Quadra</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome da Quadra</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                            value={newCourt.name}
                            onChange={(e) => setNewCourt({ ...newCourt, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Preço por Hora</label>
                        <input
                            type="number"
                            className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                            value={newCourt.price}
                            onChange={(e) => setNewCourt({ ...newCourt, price: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                        >
                            Adicionar Quadra
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Quadras Cadastradas</h3>
                <div className="space-y-4">
                    {courts.map(court => (
                        <div key={court.objectId} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">{court.objectData.name}</h4>
                                <p className="text-sm text-gray-500">R$ {court.objectData.price}/hora</p>
                            </div>
                            <button
                                onClick={async () => {
                                    if (confirm('Tem certeza que deseja excluir esta quadra?')) {
                                        try {
                                            await trickleDeleteObject('court', court.objectId);
                                            await loadCourts();
                                            onSuccess('Sucesso', 'Quadra excluída com sucesso!');
                                        } catch (error) {
                                            reportError(error);
                                            onError('Erro', 'Erro ao excluir quadra');
                                        }
                                    }
                                }}
                                className="text-red-600 hover:text-red-800"
                            >
                                Excluir
                            </button>
                        </div>
                    ))}
                    {courts.length === 0 && (
                        <p className="text-center text-gray-500">Nenhuma quadra cadastrada</p>
                    )}
                </div>
            </div>
        </div>
    );
}

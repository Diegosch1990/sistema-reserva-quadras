function CustomerModal({ isOpen, onClose, onSave }) {
    const [newCustomer, setNewCustomer] = React.useState({ name: '', whatsapp: '' });

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            if (!newCustomer.name || !newCustomer.whatsapp) {
                alert('Por favor, preencha todos os campos');
                return;
            }

            const response = await trickleCreateObject('customer', newCustomer);
            onSave(response);
            setNewCustomer({ name: '', whatsapp: '' });
            onClose();
        } catch (error) {
            reportError(error);
            alert('Erro ao salvar cliente');
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Cadastrar Novo Cliente</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Nome:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={newCustomer.name}
                            onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">WhatsApp:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={newCustomer.whatsapp}
                            onChange={e => setNewCustomer({...newCustomer, whatsapp: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

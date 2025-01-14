function CustomerControl() {
    const [customers, setCustomers] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredCustomers, setFilteredCustomers] = React.useState([]);
    const [newCustomer, setNewCustomer] = React.useState({ name: '', whatsapp: '', email: '', notes: '' });
    const [editingCustomer, setEditingCustomer] = React.useState(null);
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        loadCustomers();
    }, []);

    React.useEffect(() => {
        filterCustomers();
    }, [searchTerm, customers]);

    async function loadCustomers() {
        try {
            setIsLoading(true);
            const response = await safeListObjects('customer', 100, true);
            setCustomers(response || []);
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao carregar clientes',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }

    function filterCustomers() {
        if (!searchTerm) {
            setFilteredCustomers(customers);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filtered = customers.filter(customer => {
            const data = customer.objectData;
            return data.name.toLowerCase().includes(searchLower) ||
                   data.whatsapp.includes(searchTerm) ||
                   (data.email && data.email.toLowerCase().includes(searchLower));
        });
        setFilteredCustomers(filtered);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!newCustomer.name || !newCustomer.whatsapp) {
                setShowMessage({
                    show: true,
                    title: 'Erro',
                    message: 'Por favor, preencha nome e WhatsApp',
                    type: 'error'
                });
                return;
            }

            if (editingCustomer) {
                await safeUpdateObject('customer', editingCustomer.objectId, newCustomer);
                setShowMessage({
                    show: true,
                    title: 'Sucesso',
                    message: 'Cliente atualizado com sucesso!',
                    type: 'success'
                });
                setEditingCustomer(null);
            } else {
                await safeCreateObject('customer', newCustomer);
                setShowMessage({
                    show: true,
                    title: 'Sucesso',
                    message: 'Cliente adicionado com sucesso!',
                    type: 'success'
                });
            }
            
            setNewCustomer({ name: '', whatsapp: '', email: '', notes: '' });
            await loadCustomers();
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao salvar cliente',
                type: 'error'
            });
        }
    }

    async function handleDeleteCustomer(customerId) {
        try {
            await safeDeleteObject('customer', customerId);
            await loadCustomers();
            setShowMessage({
                show: true,
                title: 'Sucesso',
                message: 'Cliente excluído com sucesso!',
                type: 'success'
            });
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao excluir cliente',
                type: 'error'
            });
        }
    }

    function handleEditCustomer(customer) {
        setEditingCustomer(customer);
        setNewCustomer({
            name: customer.objectData.name,
            whatsapp: customer.objectData.whatsapp,
            email: customer.objectData.email || '',
            notes: customer.objectData.notes || ''
        });
    }

    if (isLoading) {
        return (
            <div className="container mx-auto my-8 flex justify-center items-center h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Carregando clientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Controle de Clientes</h2>
                </div>

                <div className="p-6">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar por nome, WhatsApp ou email"
                                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg
                                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Add/Edit Form */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium mb-4">
                            {editingCustomer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={newCustomer.whatsapp}
                                    onChange={e => setNewCustomer({...newCustomer, whatsapp: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={newCustomer.email}
                                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={newCustomer.notes}
                                    onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end space-x-3">
                                {editingCustomer && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingCustomer(null);
                                            setNewCustomer({ name: '', whatsapp: '', email: '', notes: '' });
                                        }}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingCustomer ? 'Atualizar' : 'Adicionar'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Customers List */}
                    <div className="bg-white rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nome
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            WhatsApp
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Observações
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCustomers.map(customer => (
                                        <tr key={customer.objectId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {customer.objectData.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {customer.objectData.whatsapp}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {customer.objectData.email || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500">
                                                    {customer.objectData.notes || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditCustomer(customer)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja excluir este cliente?')) {
                                                            handleDeleteCustomer(customer.objectId);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredCustomers.length === 0 && (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                    <p className="mt-4 text-gray-500 text-lg">
                                        Nenhum cliente encontrado
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
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

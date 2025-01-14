import React from 'react';

export function Releases() {
    const [releases, setReleases] = React.useState([]);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [formData, setFormData] = React.useState({
        type: 'entrada',
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'dinheiro',
        status: 'pago'
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [filterType, setFilterType] = React.useState('all');
    const [dateRange, setDateRange] = React.useState({
        start: '',
        end: ''
    });
    const [showMessage, setShowMessage] = React.useState({ 
        show: false, 
        title: '', 
        message: '', 
        type: 'success' 
    });

    React.useEffect(() => {
        loadReleases();
    }, []);

    async function loadReleases() {
        try {
            setIsLoading(true);
            const response = await safeListObjects('releases', 100, true);
            setReleases(response || []);
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao carregar lançamentos',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const categories = {
        entrada: ['Mensalidade', 'Aluguel de Quadra', 'Venda de Produtos', 'Eventos', 'Outros'],
        saida: ['Manutenção', 'Funcionários', 'Contas', 'Materiais', 'Marketing', 'Impostos', 'Outros']
    };

    const paymentMethods = [
        { value: 'dinheiro', label: 'Dinheiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { value: 'pix', label: 'PIX', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { value: 'cartao_credito', label: 'Cartão de Crédito', icon: 'M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { value: 'cartao_debito', label: 'Cartão de Débito', icon: 'M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { value: 'transferencia', label: 'Transferência Bancária', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
        { value: 'boleto', label: 'Boleto', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
    ];

    const filteredReleases = React.useMemo(() => {
        return releases.filter(release => {
            const matchesType = filterType === 'all' || release.objectData.type === filterType;
            const releaseDate = new Date(release.objectData.date);
            const matchesDateRange = 
                (!dateRange.start || releaseDate >= new Date(dateRange.start)) &&
                (!dateRange.end || releaseDate <= new Date(dateRange.end));
            return matchesType && matchesDateRange;
        });
    }, [releases, filterType, dateRange]);

    const totals = React.useMemo(() => {
        const income = filteredReleases
            .filter(r => r.objectData.type === 'entrada')
            .reduce((sum, r) => sum + parseFloat(r.objectData.amount || 0), 0);
        
        const expenses = filteredReleases
            .filter(r => r.objectData.type === 'saida')
            .reduce((sum, r) => sum + parseFloat(r.objectData.amount || 0), 0);

        return {
            income,
            expenses,
            balance: income - expenses
        };
    }, [filteredReleases]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await safeCreateObject('releases', formData);
            await loadReleases();
            setShowAddModal(false);
            setFormData({
                type: 'entrada',
                category: '',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                paymentMethod: 'dinheiro',
                status: 'pago'
            });
            setShowMessage({
                show: true,
                title: 'Sucesso',
                message: 'Lançamento criado com sucesso!',
                type: 'success'
            });
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao criar lançamento',
                type: 'error'
            });
        }
    }

    async function handleDelete(releaseId) {
        try {
            await safeDeleteObject('releases', releaseId);
            await loadReleases();
            setShowMessage({
                show: true,
                title: 'Sucesso',
                message: 'Lançamento excluído com sucesso!',
                type: 'success'
            });
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao excluir lançamento',
                type: 'error'
            });
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto my-8 flex justify-center items-center h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Carregando lançamentos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Lançamentos Financeiros</h2>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Total Entradas</p>
                                <p className="text-3xl font-bold mt-1">R$ {totals.income.toFixed(2)}</p>
                            </div>
                            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100">Total Saídas</p>
                                <p className="text-3xl font-bold mt-1">R$ {totals.expenses.toFixed(2)}</p>
                            </div>
                            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Saldo</p>
                                <p className="text-3xl font-bold mt-1">R$ {totals.balance.toFixed(2)}</p>
                            </div>
                            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="px-6 pb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todos os tipos</option>
                                <option value="entrada">Entradas</option>
                                <option value="saida">Saídas</option>
                            </select>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Novo Lançamento</span>
                        </button>
                    </div>
                </div>

                {/* Releases Table */}
                <div className="px-6 pb-6">
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoria
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descrição
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Forma de Pagamento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valor
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReleases.map(release => (
                                    <tr key={release.objectId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(release.objectData.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                release.objectData.type === 'entrada' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {release.objectData.type === 'entrada' ? 'Entrada' : 'Saída'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {release.objectData.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {release.objectData.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                        d={paymentMethods.find(pm => pm.value === release.objectData.paymentMethod)?.icon} />
                                                </svg>
                                                <span>{paymentMethods.find(pm => pm.value === release.objectData.paymentMethod)?.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                release.objectData.status === 'pago'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {release.objectData.status === 'pago' ? 'Pago' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <span className={release.objectData.type === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                                                R$ {parseFloat(release.objectData.amount).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
                                                        handleDelete(release.objectId);
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

                        {filteredReleases.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-4 text-gray-500 text-lg">
                                    Nenhum lançamento encontrado
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Release Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-bold mb-4">Novo Lançamento</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tipo
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value, category: ''})}
                                        className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        <option value="entrada">Entrada</option>
                                        <option value="saida">Saída</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Categoria
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categories[formData.type].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Forma de Pagamento
                                    </label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                                        className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        {paymentMethods.map(pm => (
                                            <option key={pm.value} value={pm.value}>{pm.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value})}
                                        className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        <option value="pago">Pago</option>
                                        <option value="pendente">Pendente</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Descrição
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Valor
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Data
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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

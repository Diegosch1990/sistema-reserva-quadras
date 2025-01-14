function ReleaseModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        type: 'entrada',
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'dinheiro',
        status: 'pago'
    });

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

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            reportError(error);
            console.error('Error saving release:', error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl px-6 py-4">
                    <h3 className="text-xl font-bold text-white">Novo Lançamento</h3>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Type and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Lançamento
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, type: 'entrada', category: ''})}
                                        className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                                            formData.type === 'entrada'
                                                ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                                : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Entrada
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, type: 'saida', category: ''})}
                                        className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                                            formData.type === 'saida'
                                                ? 'bg-red-100 text-red-800 border-2 border-red-500'
                                                : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                        </svg>
                                        Saída
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoria
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories[formData.type].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição
                            </label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Amount and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valor
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Method and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Forma de Pagamento
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {paymentMethods.map(method => (
                                        <button
                                            key={method.value}
                                            type="button"
                                            onClick={() => setFormData({...formData, paymentMethod: method.value})}
                                            className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                                                formData.paymentMethod === method.value
                                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                                                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                                            }`}
                                        >
                                            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={method.icon} />
                                            </svg>
                                            <span className="text-xs">{method.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, status: 'pago'})}
                                        className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                                            formData.status === 'pago'
                                                ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                                : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Pago
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, status: 'pendente'})}
                                        className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                                            formData.status === 'pendente'
                                                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'
                                                : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Pendente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

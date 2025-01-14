function FinancialReport({ data }) {
    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-700">Receitas</h3>
                    <p className="text-2xl font-bold text-green-600">
                        R$ {data.summary.totalIncome.toFixed(2)}
                    </p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-700">Despesas</h3>
                    <p className="text-2xl font-bold text-red-600">
                        R$ {data.summary.totalExpenses.toFixed(2)}
                    </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700">Saldo</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        R$ {data.summary.balance.toFixed(2)}
                    </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-700">Margem</h3>
                    <p className="text-2xl font-bold text-purple-600">
                        {data.summary.profitMargin.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Categories Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-medium mb-4">Receitas por Categoria</h3>
                    <div className="space-y-4">
                        {Object.entries(data.incomeByCategory).map(([category, amount]) => (
                            <div key={category}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{category}</span>
                                    <span>R$ {amount.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${(amount / data.summary.totalIncome) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-medium mb-4">Despesas por Categoria</h3>
                    <div className="space-y-4">
                        {Object.entries(data.expensesByCategory).map(([category, amount]) => (
                            <div key={category}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{category}</span>
                                    <span>R$ {amount.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-red-500 h-2 rounded-full"
                                        style={{ width: `${(amount / data.summary.totalExpenses) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
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
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.releases.map(release => (
                            <tr key={release.objectId}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(release.objectData.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        release.objectData.type === 'entrada'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {release.objectData.type === 'entrada' ? 'Entrada' : 'Saída'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{release.objectData.category}</td>
                                <td className="px-6 py-4">{release.objectData.description}</td>
                                <td className="px-6 py-4">R$ {release.objectData.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

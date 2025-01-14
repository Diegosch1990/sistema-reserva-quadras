function CustomersReport({ data }) {
    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700">Total de Clientes</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {data.summary.totalCustomers}
                    </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-700">Clientes Ativos</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {data.summary.activeCustomers}
                    </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-700">Receita Total</h3>
                    <p className="text-2xl font-bold text-purple-600">
                        R$ {data.summary.totalRevenue.toFixed(2)}
                    </p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-700">Média por Cliente</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                        R$ {data.summary.averageRevenuePerCustomer.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Customer Activity Chart */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-medium mb-4">Distribuição de Clientes por Atividade</h3>
                <div className="h-64 flex items-center justify-center">
                    <div className="w-64 h-64 relative">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            {/* Active Customers */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="10"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#34D399"
                                strokeWidth="10"
                                strokeDasharray={`${(data.summary.activeCustomers / data.summary.totalCustomers) * 283} 283`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-700">
                                {Math.round((data.summary.activeCustomers / data.summary.totalCustomers) * 100)}%
                            </span>
                            <span className="text-sm text-gray-500">Ativos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-medium mb-4">Top 10 Clientes</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total de Reservas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Última Reserva
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.customerStats.slice(0, 10).map(customer => (
                                <tr key={customer.objectId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {customer.objectData.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {customer.objectData.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {customer.objectData.whatsapp}
                                        </div>
                                        {customer.objectData.email && (
                                            <div className="text-sm text-gray-500">
                                                {customer.objectData.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {customer.bookingsCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            R$ {customer.totalSpent.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {customer.lastBooking 
                                                ? new Date(customer.lastBooking).toLocaleDateString()
                                                : '-'
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Activity Timeline */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-medium mb-4">Atividade Recente</h3>
                <div className="flow-root">
                    <ul className="-mb-8">
                        {data.customerStats
                            .filter(customer => customer.lastBooking)
                            .sort((a, b) => new Date(b.lastBooking) - new Date(a.lastBooking))
                            .slice(0, 5)
                            .map((customer, index) => (
                                <li key={customer.objectId}>
                                    <div className="relative pb-8">
                                        {index < 4 && (
                                            <span
                                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium text-gray-900">
                                                            {customer.objectData.name}
                                                        </span>
                                                        {' realizou '}
                                                        <span className="font-medium text-gray-900">
                                                            {customer.bookingsCount}
                                                        </span>
                                                        {' reservas'}
                                                    </p>
                                                </div>
                                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                    <time dateTime={customer.lastBooking}>
                                                        {new Date(customer.lastBooking).toLocaleDateString()}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

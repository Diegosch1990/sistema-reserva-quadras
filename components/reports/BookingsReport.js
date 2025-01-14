function BookingsReport({ data }) {
    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700">Total de Reservas</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {data.summary.totalBookings}
                    </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-700">Receita Total</h3>
                    <p className="text-2xl font-bold text-green-600">
                        R$ {data.summary.totalRevenue.toFixed(2)}
                    </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-700">Média Diária</h3>
                    <p className="text-2xl font-bold text-purple-600">
                        {data.summary.averageBookingsPerDay.toFixed(1)}
                    </p>
                </div>
            </div>

            {/* Bookings by Day Chart */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-medium mb-4">Reservas por Dia</h3>
                <div className="h-64">
                    <div className="h-full flex items-end space-x-2">
                        {Object.entries(data.bookingsByDay).map(([day, count]) => (
                            <div key={day} className="flex-1 flex flex-col items-center">
                                <div 
                                    className="w-full bg-blue-500 rounded-t transition-all duration-500"
                                    style={{ height: `${(count / Math.max(...Object.values(data.bookingsByDay))) * 100}%` }}
                                >
                                    <div className="text-white text-center -mt-6">{count}</div>
                                </div>
                                <div className="text-sm mt-2">{day}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quadra
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Horário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.bookings.map(booking => (
                            <tr key={booking.objectId}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(booking.objectData.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">{booking.objectData.userName}</td>
                                <td className="px-6 py-4">{booking.objectData.courtName}</td>
                                <td className="px-6 py-4">{booking.objectData.time}</td>
                                <td className="px-6 py-4">R$ {booking.objectData.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

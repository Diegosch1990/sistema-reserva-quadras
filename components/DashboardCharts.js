function DashboardCharts({ bookings }) {
    const [chartData, setChartData] = React.useState({
        daily: [],
        weekly: [],
        monthly: []
    });

    React.useEffect(() => {
        processChartData();
    }, [bookings]);

    function processChartData() {
        // Processamento de dados para gráficos diários
        const today = new Date();
        const last7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const dailyData = last7Days.reduce((acc, date) => {
            const count = bookings.filter(booking => 
                booking.objectData.date === date
            ).length;
            acc[date] = count;
            return acc;
        }, {});

        // Processamento de dados para gráficos mensais
        const last6Months = Array.from({length: 6}, (_, i) => {
            const date = new Date();
            date.setMonth(today.getMonth() - i);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }).reverse();

        const monthlyData = last6Months.reduce((acc, month) => {
            const monthBookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.objectData.date);
                return `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}` === month;
            });

            const revenue = monthBookings.reduce((sum, booking) => 
                sum + (parseFloat(booking.objectData.price) || 0), 0
            );

            acc[month] = revenue;
            return acc;
        }, {});

        setChartData({
            daily: Object.entries(dailyData),
            monthly: Object.entries(monthlyData)
        });
    }

    const maxDailyValue = Math.max(...chartData.daily.map(([_, count]) => count), 1);
    const maxMonthlyValue = Math.max(...chartData.monthly.map(([_, value]) => value), 1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de Ocupação Diária */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Ocupação Diária (Últimos 7 dias)</h3>
                <div className="h-64">
                    <div className="h-full flex items-end space-x-2">
                        {chartData.daily.map(([date, count]) => (
                            <div key={date} className="flex-1 flex flex-col items-center">
                                <div className="w-full relative flex flex-col justify-end h-[200px]">
                                    <div 
                                        className="w-full bg-blue-500 rounded-t transition-all duration-500"
                                        style={{ height: `${(count / maxDailyValue) * 100}%` }}
                                    >
                                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                                            {count}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs mt-2">
                                    {new Date(date).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit'
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gráfico de Receita */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Receita Mensal (Últimos 6 meses)</h3>
                <div className="h-64">
                    <div className="h-full flex items-end space-x-2">
                        {chartData.monthly.map(([month, value]) => (
                            <div key={month} className="flex-1 flex flex-col items-center">
                                <div className="w-full relative flex flex-col justify-end h-[200px]">
                                    <div 
                                        className="w-full bg-green-500 rounded-t transition-all duration-500"
                                        style={{ height: `${(value / maxMonthlyValue) * 100}%` }}
                                    >
                                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                                            R$ {value.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs mt-2">
                                    {new Date(month).toLocaleDateString('pt-BR', {
                                        month: 'short',
                                        year: '2-digit'
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

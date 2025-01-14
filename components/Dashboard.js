function Dashboard({ bookings }) {
    const [stats, setStats] = React.useState({
        totalBookings: 0,
        todayBookings: 0,
        weeklyBookings: 0,
        monthlyIncome: 0
    });
    const [availableSlots, setAvailableSlots] = React.useState([]);
    const [courts, setCourts] = React.useState([]);
    const [currentDay, setCurrentDay] = React.useState('');
    const [bookingSettings, setBookingSettings] = React.useState(null);

    React.useEffect(() => {
        loadInitialData();
        calculateStats();
        loadAvailableSlots();
    }, [bookings]);

    async function loadInitialData() {
        try {
            const [courtsResponse, settingsResponse] = await Promise.all([
                safeListObjects('court', 100, true),
                safeListObjects('booking_settings', 1, true)
            ]);

            setCourts(courtsResponse || []);
            if (settingsResponse && settingsResponse.length > 0) {
                setBookingSettings(settingsResponse[0].objectData);
            }

            setCurrentDay(getCurrentDayName());
        } catch (error) {
            reportError(error);
            console.error('Error loading initial data:', error);
        }
    }

    function getCurrentDayName() {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[new Date().getDay()];
    }

    function calculateStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings.filter(booking => booking.objectData.date === today);
        
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weeklyBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.objectData.date);
            return bookingDate >= weekStart;
        });

        const monthlyIncome = bookings.reduce((total, booking) => {
            const bookingDate = new Date(booking.objectData.date);
            if (bookingDate.getMonth() === new Date().getMonth()) {
                return total + parseFloat(booking.objectData.price || 0);
            }
            return total;
        }, 0);

        setStats({
            totalBookings: bookings.length,
            todayBookings: todayBookings.length,
            weeklyBookings: weeklyBookings.length,
            monthlyIncome
        });
    }

    async function loadAvailableSlots() {
        if (!bookingSettings || !courts.length) return;

        const slots = [];
        const operatingHours = bookingSettings.operatingHours;
        const hours = currentDay === 'Sábado' || currentDay === 'Domingo' 
            ? operatingHours.weekends 
            : operatingHours.weekdays;

        for (const court of courts) {
            let currentTime = new Date(`2000-01-01 ${hours.start}`);
            const endTime = new Date(`2000-01-01 ${hours.end}`);

            while (currentTime < endTime) {
                const timeString = currentTime.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });

                const isBooked = bookings.some(booking => 
                    booking.objectData.courtId === court.objectId &&
                    booking.objectData.time === timeString &&
                    booking.objectData.day === currentDay
                );

                slots.push({
                    time: timeString,
                    courtName: court.objectData.name,
                    courtId: court.objectId,
                    available: !isBooked
                });

                currentTime.setMinutes(currentTime.getMinutes() + bookingSettings.slotDuration);
            }
        }

        setAvailableSlots(slots);
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white text-sm opacity-75">Total de Reservas</p>
                            <p className="text-white text-3xl font-bold mt-2">{stats.totalBookings}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white text-sm opacity-75">Reservas Hoje</p>
                            <p className="text-white text-3xl font-bold mt-2">{stats.todayBookings}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white text-sm opacity-75">Reservas na Semana</p>
                            <p className="text-white text-3xl font-bold mt-2">{stats.weeklyBookings}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white text-sm opacity-75">Receita Mensal</p>
                            <p className="text-white text-3xl font-bold mt-2">
                                R$ {stats.monthlyIncome.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Slots Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Horários Disponíveis - {currentDay}</h3>
                    <div className="flex gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ● Disponível
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ● Ocupado
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Horário
                                </th>
                                {courts.map(court => (
                                    <th key={court.objectId} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {court.objectData.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from(new Set(availableSlots.map(slot => slot.time))).map(time => (
                                <tr key={time}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {time}
                                    </td>
                                    {courts.map(court => {
                                        const slot = availableSlots.find(s => 
                                            s.time === time && s.courtId === court.objectId
                                        );
                                        return (
                                            <td key={`${time}-${court.objectId}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    slot?.available 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {slot?.available ? 'Disponível' : 'Ocupado'}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

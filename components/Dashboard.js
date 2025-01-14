import React from 'react';
import { safeListObjects } from '../utils/supabaseUtils';
import { formatCurrency } from '../utils/formatUtils';

export function Dashboard({ bookings }) {
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
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        loadInitialData();
    }, []);

    React.useEffect(() => {
        if (courts.length > 0 && bookings) {
            calculateStats();
            loadAvailableSlots();
        }
    }, [courts, bookings]);

    async function loadInitialData() {
        try {
            setLoading(true);
            const [courtsData, settingsData] = await Promise.all([
                safeListObjects('courts'),
                safeListObjects('booking_settings', 1)
            ]);

            setCourts(courtsData);
            if (settingsData && settingsData.length > 0) {
                setBookingSettings(settingsData[0]);
            }

            setCurrentDay(getCurrentDayName());
        } catch (err) {
            setError('Erro ao carregar dados iniciais');
            console.error('Error loading initial data:', err);
        } finally {
            setLoading(false);
        }
    }

    function getCurrentDayName() {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[new Date().getDay()];
    }

    function calculateStats() {
        if (!bookings) return;

        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings.filter(booking => booking.date.split('T')[0] === today);
        
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weeklyBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= weekStart;
        });

        const monthStart = new Date();
        monthStart.setDate(1);
        const monthlyBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= monthStart;
        });

        const monthlyIncome = monthlyBookings.reduce((total, booking) => total + (booking.price || 0), 0);

        setStats({
            totalBookings: bookings.length,
            todayBookings: todayBookings.length,
            weeklyBookings: weeklyBookings.length,
            monthlyIncome
        });
    }

    async function loadAvailableSlots() {
        if (!courts.length || !bookingSettings) return;

        const today = new Date();
        const slots = [];

        courts.forEach(court => {
            const courtSlots = generateAvailableSlots(court, today, bookingSettings);
            slots.push(...courtSlots);
        });

        setAvailableSlots(slots);
    }

    function generateAvailableSlots(court, date, settings) {
        const slots = [];
        const currentHour = date.getHours();
        const startHour = parseInt(settings.start_time.split(':')[0]);
        const endHour = parseInt(settings.end_time.split(':')[0]);

        for (let hour = startHour; hour < endHour; hour++) {
            if (date.toDateString() === new Date().toDateString() && hour <= currentHour) {
                continue;
            }

            const isBooked = bookings?.some(booking => 
                booking.court_id === court.id && 
                new Date(booking.date).getHours() === hour
            );

            if (!isBooked) {
                slots.push({
                    courtId: court.id,
                    courtName: court.name,
                    time: `${hour}:00`,
                    date: date.toISOString().split('T')[0]
                });
            }
        }

        return slots;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Erro</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Total de Reservas</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Reservas Hoje</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.todayBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Reservas na Semana</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.weeklyBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Faturamento Mensal</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(stats.monthlyIncome)}</p>
                </div>
            </div>

            {/* Available Slots */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Horários Disponíveis Hoje</h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableSlots.map((slot, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <h3 className="font-medium text-gray-900">{slot.courtName}</h3>
                                <p className="text-gray-500">{slot.time}</p>
                            </div>
                        ))}
                        {availableSlots.length === 0 && (
                            <p className="text-gray-500 col-span-full text-center py-4">
                                Nenhum horário disponível para hoje
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

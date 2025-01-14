import supabase from '../utils/supabaseClient';
import React from 'react';
import { BookingModal } from './BookingModal';
import { MessageModal } from './MessageModal';

export function TimeTable({ bookings, onBookingComplete }) {
    const [selectedDay, setSelectedDay] = React.useState('');
    const [selectedCourt, setSelectedCourt] = React.useState(null);
    const [courts, setCourts] = React.useState([]);
    const [bookingSettings, setBookingSettings] = React.useState(null);
    const [showBookingModal, setShowBookingModal] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState(null);
    const [filteredBookings, setFilteredBookings] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });

    React.useEffect(() => {
        loadInitialData();
    }, []);

    React.useEffect(() => {
        filterBookings();
    }, [selectedCourt, selectedDay, bookings]);

    async function loadInitialData() {
        try {
            setIsLoading(true);
            
            // Carregar quadras
            const { data: courtsData, error: courtsError } = await supabase
                .from('courts')
                .select('*')
                .order('name');
            
            if (courtsError) throw courtsError;
            
            // Carregar configurações
            const { data: settingsData, error: settingsError } = await supabase
                .from('booking_settings')
                .select('*')
                .limit(1)
                .single();
            
            if (settingsError) throw settingsError;
            
            setCourts(courtsData || []);
            if (courtsData && courtsData.length > 0) {
                setSelectedCourt(courtsData[0]);
            }
            
            if (settingsData) {
                setBookingSettings(settingsData);
            }

            setSelectedDay(getCurrentDayName());
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao carregar dados',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }

    function getCurrentDayName() {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[new Date().getDay()];
    }

    function filterBookings() {
        if (!selectedCourt || !selectedDay || !bookings) return;
        
        const filtered = bookings.filter(booking => 
            booking.court_id === selectedCourt.id &&
            booking.day === selectedDay
        );
        setFilteredBookings(filtered);
    }

    function isWeekend(day) {
        return day === 'Sábado' || day === 'Domingo';
    }

    function getAvailableHours() {
        if (!bookingSettings) return [];

        const hours = isWeekend(selectedDay) 
            ? bookingSettings.operating_hours.weekends 
            : bookingSettings.operating_hours.weekdays;

        if (!hours || !hours.start || !hours.end) return [];

        const slots = [];
        let currentTime = new Date(`2000-01-01 ${hours.start}`);
        const endTime = new Date(`2000-01-01 ${hours.end}`);

        while (currentTime < endTime) {
            slots.push(currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
            currentTime.setMinutes(currentTime.getMinutes() + (bookingSettings.slot_duration || 60));
        }

        return slots;
    }

    function isSlotAvailable(time) {
        return !filteredBookings.some(booking => booking.time === time);
    }

    function getBookingDetails(time) {
        if (!selectedCourt || !selectedDay) return null;
        return filteredBookings.find(booking => booking.time === time);
    }

    async function handleSlotClick(time) {
        if (!isSlotAvailable(time)) return;
        
        setSelectedSlot({
            courtId: selectedCourt.id,
            courtName: selectedCourt.name,
            day: selectedDay,
            time: time,
            price: selectedCourt.price
        });
        setShowBookingModal(true);
    }

    async function handleBookingConfirm(bookingData) {
        try {
            await onBookingComplete({
                ...bookingData,
                court_id: selectedCourt.id
            });
            setShowBookingModal(false);
        } catch (error) {
            console.error('Erro ao confirmar reserva:', error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao confirmar reserva',
                type: 'error'
            });
        }
    }

    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    if (isLoading) {
        return (
            <div className="container mx-auto my-8 flex justify-center items-center h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Carregando horários...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Grade de Horários</h2>
                </div>
                
                <div className="p-6">
                    {/* Court Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Selecione a Quadra</h3>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {courts.map(court => (
                                <button
                                    key={court.id}
                                    onClick={() => setSelectedCourt(court)}
                                    className={`px-6 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center space-x-2 ${
                                        selectedCourt?.id === court.id
                                            ? 'bg-blue-500 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>{court.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Day Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Selecione o Dia</h3>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {weekDays.map(day => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                                        selectedDay === day
                                            ? 'bg-blue-100 text-blue-700 font-medium shadow'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{day}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slots Grid */}
                    {selectedCourt && selectedDay && bookingSettings && (
                        <div className="bg-white rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {selectedCourt.name} - {selectedDay}
                                </h3>
                                <div className="flex gap-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ● Disponível
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        ● Ocupado
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {getAvailableHours().map(time => (
                                    <div className="relative group" key={time}>
                                        <button
                                            onClick={() => handleSlotClick(time)}
                                            disabled={!isSlotAvailable(time)}
                                            className={`w-full p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                                                isSlotAvailable(time)
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-md'
                                                    : 'bg-red-50 text-red-700 cursor-not-allowed'
                                            }`}
                                        >
                                            <div className="text-lg font-medium">{time}</div>
                                            <div className="text-sm mt-1">
                                                {isSlotAvailable(time) ? 'Disponível' : 'Ocupado'}
                                            </div>
                                        </button>

                                        {!isSlotAvailable(time) && getBookingDetails(time) && (
                                            <div className="absolute z-10 invisible group-hover:visible w-64 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg -top-2 left-full ml-2">
                                                <div className="relative">
                                                    <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-gray-900 border-b-[6px] border-b-transparent"></div>
                                                    <div className="space-y-2">
                                                        <div className="font-semibold text-white">
                                                            {getBookingDetails(time).user_name}
                                                        </div>
                                                        <div className="text-gray-300 text-xs">
                                                            WhatsApp: {getBookingDetails(time).whatsapp}
                                                        </div>
                                                        <div className="text-gray-300 text-xs">
                                                            Quadra: {getBookingDetails(time).court_name}
                                                        </div>
                                                        <div className="text-gray-300 text-xs">
                                                            Horário: {getBookingDetails(time).time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    onSave={handleBookingConfirm}
                    selectedSlot={selectedSlot}
                    courts={courts}
                />
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

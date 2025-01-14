function CancelForm({ bookings, onCancelComplete }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredBookings, setFilteredBookings] = React.useState([]);
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState(null);
    const [filterDate, setFilterDate] = React.useState('');
    const [filterCourt, setFilterCourt] = React.useState('');

    React.useEffect(() => {
        if (bookings && bookings.length > 0) {
            filterBookings();
        }
    }, [bookings, searchTerm, filterDate, filterCourt]);

    function filterBookings() {
        try {
            let filtered = [...bookings];

            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                filtered = filtered.filter(booking => {
                    const data = booking.objectData;
                    return data.userName.toLowerCase().includes(searchLower) ||
                           data.whatsapp.includes(searchTerm);
                });
            }

            if (filterDate) {
                filtered = filtered.filter(booking => booking.objectData.date === filterDate);
            }

            if (filterCourt) {
                filtered = filtered.filter(booking => booking.objectData.courtId === filterCourt);
            }

            setFilteredBookings(filtered);
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao filtrar reservas',
                type: 'error'
            });
        }
    }

    async function handleCancel(booking) {
        try {
            setSelectedBooking(booking);
            setShowConfirmModal(true);
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao cancelar reserva',
                type: 'error'
            });
        }
    }

    return (
        <div className="container mx-auto my-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Cancelar Reserva</h2>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buscar Cliente
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nome ou WhatsApp"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg
                                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Data
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quadra
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                value={filterCourt}
                                onChange={(e) => setFilterCourt(e.target.value)}
                            >
                                <option value="">Todas as quadras</option>
                                {Array.from(new Set(bookings.map(b => b.objectData.courtId))).map(courtId => (
                                    <option key={courtId} value={courtId}>
                                        {bookings.find(b => b.objectData.courtId === courtId)?.objectData.courtName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map(booking => (
                            <div
                                key={booking.objectId}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {booking.objectData.userName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {booking.objectData.whatsapp}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCancel(booking)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Quadra</p>
                                            <p className="font-medium text-gray-900">{booking.objectData.courtName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Data</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(booking.objectData.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Horário</p>
                                            <p className="font-medium text-gray-900">{booking.objectData.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Valor</p>
                                            <p className="font-medium text-gray-900">
                                                R$ {parseFloat(booking.objectData.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-xl font-medium text-gray-500">
                                Nenhuma reserva encontrada
                            </p>
                            <p className="text-gray-400 mt-2">
                                Tente ajustar os filtros de busca
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedBooking(null);
                }}
                onConfirm={() => {
                    onCancelComplete(selectedBooking.objectId);
                    setShowConfirmModal(false);
                    setSelectedBooking(null);
                }}
                title="Confirmar Cancelamento"
                message={
                    selectedBooking 
                        ? `Tem certeza que deseja cancelar a reserva de ${selectedBooking.objectData.userName}?\n\n` +
                          `Data: ${selectedBooking.objectData.day}\n` +
                          `Horário: ${selectedBooking.objectData.time}\n` +
                          `Quadra: ${selectedBooking.objectData.courtName}`
                        : ''
                }
            />

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

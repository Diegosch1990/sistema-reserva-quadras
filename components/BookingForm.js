import React from 'react';

export function BookingForm({ bookings, onBookingComplete }) {
    const [formData, setFormData] = React.useState({
        courtId: '',
        customerId: '',
        userName: '',
        whatsapp: '',
        day: '',
        time: '',
        courtName: ''
    });
    const [courts, setCourts] = React.useState([]);
    const [customers, setCustomers] = React.useState([]);
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });
    const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);

    React.useEffect(() => {
        loadCourts();
        loadCustomers();
    }, []);

    async function loadCourts() {
        try {
            const response = await safeListObjects('court', 100, true);
            setCourts(response || []);
            if (response && response.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    courtId: response[0].objectId,
                    courtName: response[0].objectData.name
                }));
            }
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao carregar quadras',
                type: 'error'
            });
        }
    }

    async function loadCustomers() {
        try {
            const response = await safeListObjects('customer', 100, true);
            setCustomers(response || []);
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao carregar clientes',
                type: 'error'
            });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!formData.courtId || !formData.customerId) {
                setShowMessage({
                    show: true,
                    title: 'Erro',
                    message: 'Por favor, selecione a quadra e o cliente',
                    type: 'error'
                });
                return;
            }

            const selectedCustomer = customers.find(c => c.objectId === formData.customerId);
            const selectedCourt = courts.find(c => c.objectId === formData.courtId);

            const bookingData = {
                ...formData,
                userName: selectedCustomer.objectData.name,
                whatsapp: selectedCustomer.objectData.whatsapp,
                courtName: selectedCourt.objectData.name,
                price: selectedCourt.objectData.price
            };

            await onBookingComplete(bookingData);
            setFormData({
                courtId: '',
                customerId: '',
                userName: '',
                whatsapp: '',
                day: '',
                time: '',
                courtName: ''
            });
            setShowMessage({
                show: true,
                title: 'Sucesso',
                message: 'Reserva realizada com sucesso!',
                type: 'success'
            });
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao realizar reserva',
                type: 'error'
            });
        }
    }

    return (
        <div className="container mx-auto my-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Nova Reserva</h2>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Quadra
                                </label>
                                <select
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={formData.courtId}
                                    onChange={(e) => {
                                        const court = courts.find(c => c.objectId === e.target.value);
                                        setFormData({
                                            ...formData,
                                            courtId: e.target.value,
                                            courtName: court ? court.objectData.name : ''
                                        });
                                    }}
                                    required
                                >
                                    <option value="">Selecione uma quadra</option>
                                    {courts.map(court => (
                                        <option key={court.objectId} value={court.objectId}>
                                            {court.objectData.name} - R$ {court.objectData.price}/hora
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Cliente
                                </label>
                                <div className="flex space-x-2">
                                    <select
                                        className="flex-1 h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={formData.customerId}
                                        onChange={(e) => {
                                            const customer = customers.find(c => c.objectId === e.target.value);
                                            setFormData({
                                                ...formData,
                                                customerId: e.target.value,
                                                userName: customer ? customer.objectData.name : '',
                                                whatsapp: customer ? customer.objectData.whatsapp : ''
                                            });
                                        }}
                                        required
                                    >
                                        <option value="">Selecione um cliente</option>
                                        {customers.map(customer => (
                                            <option key={customer.objectId} value={customer.objectId}>
                                                {customer.objectData.name} - {customer.objectData.whatsapp}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomerModalOpen(true)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        + Novo
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Dia
                                </label>
                                <select
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={formData.day}
                                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                                    required
                                >
                                    <option value="">Selecione um dia</option>
                                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Horário
                                </label>
                                <select
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={formData.time}
                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    required
                                >
                                    <option value="">Selecione um horário</option>
                                    {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Confirmar Reserva
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isCustomerModalOpen && (
                <CustomerModal
                    isOpen={isCustomerModalOpen}
                    onClose={() => setIsCustomerModalOpen(false)}
                    onSave={async (newCustomer) => {
                        await loadCustomers();
                        setFormData(prev => ({
                            ...prev,
                            customerId: newCustomer.objectId,
                            userName: newCustomer.objectData.name,
                            whatsapp: newCustomer.objectData.whatsapp
                        }));
                        setIsCustomerModalOpen(false);
                    }}
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

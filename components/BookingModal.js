import React from 'react';
import supabase from '../utils/supabaseClient';
import { validateBooking } from '../utils/validations';
import { WhatsAppNotification } from '../utils/notifications';
import { CustomerModal } from './CustomerModal';
import { MessageModal } from './MessageModal';

function BookingModal({ isOpen, onClose, onSave, selectedSlot }) {
    const [formData, setFormData] = React.useState({
        name: '',
        whatsapp: '',
        email: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState({ 
        show: false, 
        title: '', 
        message: '', 
        type: 'success' 
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                whatsapp: '',
                email: ''
            });
        }
    }, [isOpen]);

    const formatWhatsApp = (value) => {
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '');
        
        // Aplica a máscara
        if (numbers.length <= 11) {
            let formatted = numbers;
            if (numbers.length > 2) formatted = `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
            if (numbers.length > 7) formatted = `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7)}`;
            return formatted;
        }
        return value;
    };

    const handleWhatsAppChange = (e) => {
        const formatted = formatWhatsApp(e.target.value);
        setFormData({...formData, whatsapp: formatted});
    };

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Criar objeto de reserva
            const bookingData = {
                court_id: selectedSlot.courtId,
                day: selectedSlot.day,
                time: selectedSlot.time,
                user_name: formData.name,
                whatsapp: formData.whatsapp.replace(/\D/g, ''),
                email: formData.email || null,
                price: selectedSlot.price,
                status: 'active',
                created_at: new Date().toISOString()
            };

            // Validar dados
            const validation = validateBooking(bookingData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join('\n'));
            }

            // Salvar reserva
            await onSave(bookingData);

            // Enviar notificação
            try {
                const whatsapp = new WhatsAppNotification();
                await whatsapp.notifyBookingConfirmation(bookingData);
            } catch (notificationError) {
                console.error('Erro ao enviar notificação:', notificationError);
                // Não interromper o fluxo se a notificação falhar
            }

            onClose();

        } catch (error) {
            console.error('Erro ao salvar reserva:', error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: error.message || 'Erro ao salvar reserva',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Nova Reserva</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                        Horário selecionado: {selectedSlot.day} às {selectedSlot.time}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                        Quadra: {selectedSlot.courtName}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                        Valor: R$ {selectedSlot.price}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nome completo *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                WhatsApp *
                            </label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={handleWhatsAppChange}
                                placeholder="(11) 99999-9999"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                                maxLength="15"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Salvando...' : 'Confirmar Reserva'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {showMessage.show && (
                <MessageModal
                    isOpen={showMessage.show}
                    onClose={() => setShowMessage({ ...showMessage, show: false })}
                    title={showMessage.title}
                    message={showMessage.message}
                    type={showMessage.type}
                />
            )}
        </div>
    );
}

export default BookingModal;

import supabase from './supabaseClient';

export class WhatsAppNotification {
    constructor() {
        this.apiUrl = process.env.WHATSAPP_API_URL;
        this.apiToken = process.env.WHATSAPP_API_TOKEN;
    }

    async sendMessage(to, message) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiToken}`
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'template',
                    template: {
                        name: 'booking_confirmation',
                        language: {
                            code: 'pt_BR'
                        },
                        components: [{
                            type: 'body',
                            parameters: [{
                                type: 'text',
                                text: message
                            }]
                        }]
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar mensagem');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao enviar notificação WhatsApp:', error);
            throw error;
        }
    }

    async notifyBookingConfirmation(booking) {
        const message = `
            Olá ${booking.user_name}!
            
            Sua reserva foi confirmada:
            - Quadra: ${booking.court_name}
            - Data: ${booking.day}
            - Horário: ${booking.time}
            - Valor: R$ ${booking.price}
            
            Agradecemos a preferência!
        `.trim();

        return this.sendMessage(booking.whatsapp, message);
    }

    async notifyBookingReminder(booking) {
        const message = `
            Olá ${booking.user_name}!
            
            Lembrete da sua reserva amanhã:
            - Quadra: ${booking.court_name}
            - Horário: ${booking.time}
            
            Até lá!
        `.trim();

        return this.sendMessage(booking.whatsapp, message);
    }

    async notifyBookingCancellation(booking) {
        const message = `
            Olá ${booking.user_name}!
            
            Sua reserva foi cancelada:
            - Quadra: ${booking.court_name}
            - Data: ${booking.day}
            - Horário: ${booking.time}
            
            Esperamos você em uma próxima oportunidade!
        `.trim();

        return this.sendMessage(booking.whatsapp, message);
    }
}

// Função para agendar lembretes
export async function scheduleBookingReminders() {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDay = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][tomorrow.getDay()];

        // Buscar reservas para amanhã
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('day', tomorrowDay)
            .eq('status', 'active');

        if (error) throw error;

        const whatsapp = new WhatsAppNotification();
        
        // Enviar lembretes
        for (const booking of bookings) {
            try {
                await whatsapp.notifyBookingReminder(booking);
                console.log(`Lembrete enviado para reserva ${booking.id}`);
            } catch (error) {
                console.error(`Erro ao enviar lembrete para reserva ${booking.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Erro ao agendar lembretes:', error);
    }
}

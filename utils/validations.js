// Validações de Reserva
export const validateBooking = (bookingData) => {
    const errors = [];

    // Validação de campos obrigatórios
    if (!bookingData.court_id) errors.push('Quadra não selecionada');
    if (!bookingData.day) errors.push('Dia não selecionado');
    if (!bookingData.time) errors.push('Horário não selecionado');
    if (!bookingData.user_name) errors.push('Nome é obrigatório');
    if (!bookingData.whatsapp) errors.push('WhatsApp é obrigatório');

    // Validação de formato do WhatsApp
    const whatsapp = bookingData.whatsapp.replace(/\D/g, '');
    if (whatsapp.length < 10 || whatsapp.length > 11) {
        errors.push('Número de WhatsApp inválido');
    }

    // Validação de email (se fornecido)
    if (bookingData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
        errors.push('Email inválido');
    }

    // Validação de dia da semana
    const validDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    if (!validDays.includes(bookingData.day)) {
        errors.push('Dia da semana inválido');
    }

    // Validação de horário (formato HH:mm)
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(bookingData.time)) {
        errors.push('Formato de horário inválido');
    }

    // Validação de preço
    if (typeof bookingData.price !== 'number' || bookingData.price <= 0) {
        errors.push('Preço inválido');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validações de Quadra
export const validateCourt = (courtData) => {
    const errors = [];

    if (!courtData.name) errors.push('Nome da quadra é obrigatório');
    if (typeof courtData.price !== 'number' || courtData.price <= 0) {
        errors.push('Preço inválido');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validações de Configurações
export const validateSettings = (settings) => {
    const errors = [];

    // Validação de horários de funcionamento
    const validateHours = (hours, period) => {
        if (!hours || !hours.start || !hours.end) {
            errors.push(`Horários de funcionamento ${period} inválidos`);
            return;
        }

        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(hours.start) || !timeRegex.test(hours.end)) {
            errors.push(`Formato de horário ${period} inválido`);
        }

        const start = new Date(`2000-01-01 ${hours.start}`);
        const end = new Date(`2000-01-01 ${hours.end}`);
        if (start >= end) {
            errors.push(`Horário de início ${period} deve ser menor que o horário de fim`);
        }
    };

    if (settings.operating_hours) {
        if (settings.operating_hours.weekdays) {
            validateHours(settings.operating_hours.weekdays, 'dias úteis');
        }
        if (settings.operating_hours.weekends) {
            validateHours(settings.operating_hours.weekends, 'fins de semana');
        }
    } else {
        errors.push('Horários de funcionamento não definidos');
    }

    // Validação de duração do slot
    if (!settings.slot_duration || settings.slot_duration < 30 || settings.slot_duration > 180) {
        errors.push('Duração do slot deve estar entre 30 e 180 minutos');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

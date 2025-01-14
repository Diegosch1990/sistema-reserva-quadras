import { validateBooking, validateCourt, validateSettings } from '../utils/validations';

describe('Validações de Reserva', () => {
    const validBooking = {
        court_id: 1,
        day: 'Segunda',
        time: '14:00',
        user_name: 'João Silva',
        whatsapp: '11999999999',
        email: 'joao@email.com',
        price: 100,
        status: 'active'
    };

    test('Deve aceitar uma reserva válida', () => {
        const result = validateBooking(validBooking);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('Deve rejeitar campos obrigatórios ausentes', () => {
        const invalidBooking = { ...validBooking, user_name: '' };
        const result = validateBooking(invalidBooking);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Nome é obrigatório');
    });

    test('Deve validar formato de WhatsApp', () => {
        const invalidBooking = { ...validBooking, whatsapp: '123' };
        const result = validateBooking(invalidBooking);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Número de WhatsApp inválido');
    });

    test('Deve validar formato de email opcional', () => {
        const invalidBooking = { ...validBooking, email: 'invalid-email' };
        const result = validateBooking(invalidBooking);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Email inválido');
    });
});

describe('Validações de Quadra', () => {
    const validCourt = {
        name: 'Quadra 1',
        price: 100
    };

    test('Deve aceitar uma quadra válida', () => {
        const result = validateCourt(validCourt);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('Deve rejeitar preço inválido', () => {
        const invalidCourt = { ...validCourt, price: -50 };
        const result = validateCourt(invalidCourt);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Preço inválido');
    });
});

describe('Validações de Configurações', () => {
    const validSettings = {
        operating_hours: {
            weekdays: {
                start: '08:00',
                end: '22:00'
            },
            weekends: {
                start: '09:00',
                end: '20:00'
            }
        },
        slot_duration: 60
    };

    test('Deve aceitar configurações válidas', () => {
        const result = validateSettings(validSettings);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('Deve rejeitar horário de início maior que fim', () => {
        const invalidSettings = {
            ...validSettings,
            operating_hours: {
                ...validSettings.operating_hours,
                weekdays: {
                    start: '23:00',
                    end: '22:00'
                }
            }
        };
        const result = validateSettings(invalidSettings);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Horário de início dias úteis deve ser menor que o horário de fim');
    });

    test('Deve validar duração do slot', () => {
        const invalidSettings = { ...validSettings, slot_duration: 200 };
        const result = validateSettings(invalidSettings);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Duração do slot deve estar entre 30 e 180 minutos');
    });
});

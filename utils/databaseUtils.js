// Database utility functions with improved error handling
async function safeListObjects(objectType, limit = 100, descent = true) {
    try {
        // Add delay to prevent message port closed errors
        await new Promise(resolve => setTimeout(resolve, 0));

        // For development/testing, return mock data
        switch (objectType) {
            case 'booking':
                return [
                    {
                        objectId: '1',
                        objectData: {
                            userName: 'João Silva',
                            courtName: 'Quadra 1',
                            courtId: 'court1',
                            day: 'Segunda',
                            time: '10:00',
                            whatsapp: '11999999999',
                            date: new Date().toISOString().split('T')[0],
                            price: '100'
                        }
                    },
                    {
                        objectId: '2',
                        objectData: {
                            userName: 'Maria Santos',
                            courtName: 'Quadra 2',
                            courtId: 'court2',
                            day: 'Segunda',
                            time: '11:00',
                            whatsapp: '11988888888',
                            date: new Date().toISOString().split('T')[0],
                            price: '120'
                        }
                    }
                ];
            case 'court':
                return [
                    {
                        objectId: 'court1',
                        objectData: {
                            name: 'Quadra 1',
                            price: '100'
                        }
                    },
                    {
                        objectId: 'court2',
                        objectData: {
                            name: 'Quadra 2',
                            price: '120'
                        }
                    }
                ];
            case 'booking_settings':
                return [
                    {
                        objectId: 'settings1',
                        objectData: {
                            maxBookingsPerDay: 1,
                            minAdvanceHours: 24,
                            maxAdvanceDays: 30,
                            slotDuration: 60,
                            breakBetweenSlots: 0,
                            operatingHours: {
                                weekdays: {
                                    start: '08:00',
                                    end: '22:00'
                                },
                                weekends: {
                                    start: '09:00',
                                    end: '18:00'
                                }
                            },
                            daysActive: {
                                segunda: true,
                                terca: true,
                                quarta: true,
                                quinta: true,
                                sexta: true,
                                sabado: false,
                                domingo: false
                            }
                        }
                    }
                ];
            default:
                return [];
        }
    } catch (error) {
        if (error.message !== 'The message port closed before a response was received.') {
            reportError(error);
            console.error(`Error listing ${objectType}:`, error);
        }
        return [];
    }
}

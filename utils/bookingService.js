async function saveBooking(bookingData) {
    try {
        const response = await trickleCreateObject('booking', bookingData);
        if (!response) {
            throw new Error('Falha ao salvar a reserva');
        }
        return response;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function cancelBooking(bookingId) {
    try {
        await trickleDeleteObject('booking', bookingId);
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function getBookings() {
    try {
        const response = await trickleListObjects('booking', 100, true);
        return response.items || [];
    } catch (error) {
        reportError(error);
        throw error;
    }
}

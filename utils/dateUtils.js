function formatDate(date) {
    try {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[date.getDay()];
    } catch (error) {
        reportError(error);
        return '';
    }
}

function formatTime(date) {
    try {
        return date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    } catch (error) {
        reportError(error);
        return '';
    }
}

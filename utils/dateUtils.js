function formatDate(date) {
    try {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[date.getDay()];
    } catch (error) {
        console.error('Erro ao formatar data:', error);
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
        console.error('Erro ao formatar hora:', error);
        return '';
    }
}

function formatShortDate(date) {
    try {
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'numeric'
        });
    } catch (error) {
        console.error('Erro ao formatar data curta:', error);
        return '';
    }
}

export { formatDate, formatTime, formatShortDate };

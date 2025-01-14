// Error handling utilities
function reportError(error) {
    try {
        console.error('Error:', error);
        // Prevent message port closed errors by checking error type
        if (error && error.message !== 'The message port closed before a response was received.') {
            // Here you can add additional error reporting logic
            // For example, sending to a monitoring service
        }
    } catch (e) {
        console.error('Error in reportError:', e);
    }
}

function handleError(error, context = '') {
    try {
        // Don't log message port closed errors
        if (error && error.message !== 'The message port closed before a response was received.') {
            console.error(`Error in ${context}:`, error);
        }

        // Format error message for display
        let message = error.message || 'Um erro inesperado ocorreu';
        if (error.response) {
            message = `Erro ${error.response.status}: ${error.response.statusText}`;
        }

        // Report error to monitoring system
        reportError({
            message,
            context,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        return message;
    } catch (e) {
        console.error('Error in error handler:', e);
        return 'Um erro inesperado ocorreu';
    }
}

function showErrorMessage(error, setShowMessage) {
    try {
        // Don't show message port closed errors to users
        if (error && error.message === 'The message port closed before a response was received.') {
            return;
        }

        const message = handleError(error);
        setShowMessage({
            show: true,
            title: 'Erro',
            message,
            type: 'error'
        });
    } catch (e) {
        console.error('Error in showErrorMessage:', e);
        setShowMessage({
            show: true,
            title: 'Erro',
            message: 'Um erro inesperado ocorreu',
            type: 'error'
        });
    }
}

// Make error handling functions globally available
window.reportError = reportError;
window.handleError = handleError;
window.showErrorMessage = showErrorMessage;

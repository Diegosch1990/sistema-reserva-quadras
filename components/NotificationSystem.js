function NotificationSystem() {
    const [notifications, setNotifications] = React.useState([]);
    const [showAll, setShowAll] = React.useState(false);

    React.useEffect(() => {
        loadNotifications();
        // Atualiza as notificações a cada 5 minutos
        const interval = setInterval(loadNotifications, 300000);
        return () => clearInterval(interval);
    }, []);

    async function loadNotifications() {
        try {
            const response = await safeListObjects('notifications', 100, true);
            setNotifications(response);
        } catch (error) {
            reportError(error);
            console.error('Erro ao carregar notificações:', error);
        }
    }

    async function markAsRead(notificationId) {
        try {
            await safeUpdateObject('notifications', notificationId, { read: true });
            await loadNotifications();
        } catch (error) {
            reportError(error);
            console.error('Erro ao marcar notificação como lida:', error);
        }
    }

    async function deleteNotification(notificationId) {
        try {
            await safeDeleteObject('notifications', notificationId);
            await loadNotifications();
        } catch (error) {
            reportError(error);
            console.error('Erro ao deletar notificação:', error);
        }
    }

    const unreadCount = notifications.filter(n => !n.objectData.read).length;
    const displayNotifications = showAll ? notifications : notifications.slice(0, 5);

    return {
        notifications: displayNotifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        loadNotifications,
        showAll,
        setShowAll
    };
}

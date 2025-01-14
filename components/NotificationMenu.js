function NotificationMenu({ notifications, unreadCount, markAsRead, deleteNotification, showAll, setShowAll }) {
    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                    Notificações
                    {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount} nova{unreadCount !== 1 && 's'}
                        </span>
                    )}
                </h3>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {showAll ? 'Mostrar Menos' : 'Ver Todas'}
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div 
                            key={notification.objectId} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                !notification.objectData.read ? 'bg-blue-50' : ''
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800">{notification.objectData.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {!notification.objectData.read && (
                                        <button
                                            onClick={() => markAsRead(notification.objectId)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.objectId)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        Nenhuma notificação
                    </div>
                )}
            </div>
        </div>
    );
}

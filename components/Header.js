import React from 'react';

export function Header({ onSettingsClick }) {
    // ... (previous state and effects remain the same)

    return (
        <div data-name="header" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="container mx-auto">
                {/* Top Bar */}
                <div className="py-2 px-3 sm:px-6 border-b border-blue-500 flex flex-col sm:flex-row justify-between items-center text-sm">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime()}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">{formatDate()}</span>
                            <span className="inline sm:hidden">{formatShortDate()}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {businessData.phone && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="hidden sm:inline">{businessData.phone}</span>
                                <span className="inline sm:hidden">Tel</span>
                            </div>
                        )}
                        {businessData.email && (
                            <div className="hidden sm:flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {businessData.email}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Header */}
                <div className="py-4 sm:py-6 px-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between relative">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        {businessData.logo && (
                            <img 
                                src={businessData.logo} 
                                alt="Logo" 
                                className="h-12 sm:h-16 w-auto"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                        <div className="text-center sm:text-left">
                            <h1 data-name="header-title" className="text-xl sm:text-3xl font-bold tracking-tight">
                                {businessData.name}
                            </h1>
                            <p data-name="header-subtitle" className="text-sm sm:text-base text-blue-100 mt-1">
                                Gerencie suas reservas de forma simples e eficiente
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="relative">
                            <button 
                                id="notification-button"
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div 
                                    id="notification-menu"
                                    className="absolute right-0 mt-2 w-full sm:w-80 bg-white rounded-lg shadow-xl z-50"
                                >
                                    {/* ... (notification menu content remains the same) ... */}
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={onSettingsClick}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Erro</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );

    function formatShortDate() {
        return currentTime.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'numeric'
        });
    }
}

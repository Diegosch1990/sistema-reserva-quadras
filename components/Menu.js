import React from 'react';

export function Menu({ onMenuSelect, currentView }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'schedule', label: 'Horários', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'book', label: 'Reserva', icon: 'M12 4v16m8-8H4' },
        { id: 'cancel', label: 'Cancelar', icon: 'M6 18L18 6M6 6l12 12' },
        { id: 'customers', label: 'Clientes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { id: 'releases', label: 'Lançamentos', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'reports', label: 'Relatórios', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { id: 'exit', label: 'Sair', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' }
    ];

    return (
        <div data-name="menu" className="container mx-auto my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        data-name={`menu-button-${item.id}`}
                        className={`menu-button p-6 rounded-xl shadow-lg text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 ${
                            currentView === item.id
                                ? 'bg-blue-500 text-white'
                                : item.id === 'exit'
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => onMenuSelect(item.id)}
                    >
                        <svg 
                            className={`w-6 h-6 mb-2 ${
                                currentView === item.id || item.id === 'exit'
                                    ? 'text-white'
                                    : 'text-gray-500'
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d={item.icon}
                            />
                        </svg>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

import React from 'react';
import { formatDate, formatTime, formatShortDate } from '../utils/dateUtils';

export function Header({ onSettingsClick }) {
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [businessData] = React.useState({
        name: 'Sistema de Reserva de Quadras',
        phone: '(11) 99999-9999'
    });

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                            {formatTime(currentTime)}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">{formatDate(currentTime)}</span>
                            <span className="inline sm:hidden">{formatShortDate(currentTime)}</span>
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
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="hidden sm:inline">{businessData.email}</span>
                                <span className="inline sm:hidden">@</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Header */}
                <div className="py-4 px-3 sm:px-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl sm:text-2xl font-bold">{businessData.name}</h1>
                        <button
                            onClick={onSettingsClick}
                            className="p-2 hover:bg-blue-700 rounded-full transition-colors duration-200"
                            title="Configurações"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

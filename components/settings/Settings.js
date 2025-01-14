function Settings({ onSuccess, onError }) {
    const [activeTab, setActiveTab] = React.useState('admin');
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });

    const tabs = [
        { 
            id: 'admin', 
            label: 'Administrador',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        { 
            id: 'courts', 
            label: 'Quadras',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        { 
            id: 'business', 
            label: 'Estabelecimento',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        { 
            id: 'hours', 
            label: 'Grade de Horários',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        { 
            id: 'opening', 
            label: 'Horário de Funcionamento',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        { 
            id: 'booking', 
            label: 'Reservas',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    const handleSuccess = (title, message) => {
        if (onSuccess) {
            onSuccess(title, message);
        } else {
            setShowMessage({
                show: true,
                title,
                message,
                type: 'success'
            });
        }
    };

    const handleError = (title, message) => {
        if (onError) {
            onError(title, message);
        } else {
            setShowMessage({
                show: true,
                title,
                message,
                type: 'error'
            });
        }
    };

    return (
        <div className="container mx-auto my-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-blue-400">
                    <nav className="flex flex-wrap -mb-px">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center space-x-2 px-6 py-4 
                                    ${activeTab === tab.id 
                                        ? 'border-white text-white border-b-2 bg-white bg-opacity-10' 
                                        : 'border-transparent text-blue-100 hover:text-white hover:border-blue-200'}
                                    transition-all duration-200
                                `}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'admin' && (
                            <AdminSettings 
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        )}
                        {activeTab === 'courts' && (
                            <CourtManagement 
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        )}
                        {activeTab === 'business' && (
                            <BusinessSettings 
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        )}
                        {activeTab === 'hours' && (
                            <HoursSettings 
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        )}
                        {activeTab === 'opening' && (
                            <OpeningHoursSettings 
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        )}
                        {activeTab === 'booking' && (
                            <BookingSettings 
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        )}
                    </div>
                </div>
            </div>

            <MessageModal
                isOpen={showMessage.show}
                onClose={() => setShowMessage({ show: false, title: '', message: '', type: 'success' })}
                title={showMessage.title}
                message={showMessage.message}
                type={showMessage.type}
            />
        </div>
    );
}

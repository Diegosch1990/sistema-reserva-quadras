function Settings({ onSuccess, onError }) {
    const [activeTab, setActiveTab] = React.useState('admin');

    const tabs = [
        { 
            id: 'admin', 
            label: 'Administrador',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            description: 'Gerencie as configurações de administrador do sistema'
        },
        { 
            id: 'courts', 
            label: 'Quadras',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            description: 'Configure as quadras disponíveis e seus preços'
        },
        { 
            id: 'business', 
            label: 'Estabelecimento',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            description: 'Defina as informações do seu estabelecimento'
        },
        { 
            id: 'schedule', 
            label: 'Agendamentos',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            description: 'Configure os horários e regras de agendamento'
        }
    ];

    return (
        <div className="container mx-auto my-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Configurações do Sistema</h2>
                    <p className="text-blue-100 mt-1">Gerencie todas as configurações do seu estabelecimento</p>
                </div>

                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200">
                        <nav className="p-4">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center space-x-3 transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`${
                                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        {tab.icon}
                                    </div>
                                    <div>
                                        <div className={`font-medium ${
                                            activeTab === tab.id ? 'text-blue-600' : 'text-gray-900'
                                        }`}>
                                            {tab.label}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {tab.description}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        {activeTab === 'admin' && (
                            <AdminSettings 
                                onSuccess={onSuccess}
                                onError={onError}
                            />
                        )}
                        {activeTab === 'courts' && (
                            <CourtManagement 
                                onSuccess={onSuccess}
                                onError={onError}
                            />
                        )}
                        {activeTab === 'business' && (
                            <BusinessSettings 
                                onSuccess={onSuccess}
                                onError={onError}
                            />
                        )}
                        {activeTab === 'schedule' && (
                            <SchedulingSettings 
                                onSuccess={onSuccess}
                                onError={onError}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

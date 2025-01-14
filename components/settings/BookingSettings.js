function BookingSettings({ onSuccess, onError }) {
    const [settings, setSettings] = React.useState({
        maxBookingsPerDay: 1,
        minAdvanceHours: 24,
        maxAdvanceDays: 30,
        slotDuration: 60,
        breakBetweenSlots: 0,
        operatingHours: {
            weekdays: {
                start: '08:00',
                end: '22:00'
            },
            weekends: {
                start: '09:00',
                end: '18:00'
            }
        },
        daysActive: {
            segunda: true,
            terca: true,
            quarta: true,
            quinta: true,
            sexta: true,
            sabado: false,
            domingo: false
        }
    });

    React.useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const response = await safeListObjects('booking_settings', 1, true);
            if (response && response.length > 0 && response[0].objectData) {
                setSettings(prev => ({
                    ...prev,
                    ...response[0].objectData
                }));
            }
        } catch (error) {
            reportError(error);
            if (onError) onError('Erro', 'Erro ao carregar configurações');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await safeListObjects('booking_settings', 1, true);
            if (response && response.length > 0) {
                await safeUpdateObject('booking_settings', response[0].objectId, settings);
            } else {
                await safeCreateObject('booking_settings', settings);
            }
            if (onSuccess) onSuccess('Sucesso', 'Configurações atualizadas com sucesso!');
        } catch (error) {
            reportError(error);
            if (onError) onError('Erro', 'Erro ao atualizar configurações');
        }
    }

    const inputClasses = "mt-1 block w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Configurações de Reservas</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Limites de Reserva</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Máximo de Reservas por Dia
                            </label>
                            <input
                                type="number"
                                min="1"
                                className={inputClasses}
                                value={settings.maxBookingsPerDay}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    maxBookingsPerDay: parseInt(e.target.value)
                                }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Antecedência Mínima (horas)
                            </label>
                            <input
                                type="number"
                                min="0"
                                className={inputClasses}
                                value={settings.minAdvanceHours}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    minAdvanceHours: parseInt(e.target.value)
                                }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Antecedência Máxima (dias)
                            </label>
                            <input
                                type="number"
                                min="1"
                                className={inputClasses}
                                value={settings.maxAdvanceDays}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    maxAdvanceDays: parseInt(e.target.value)
                                }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Horários de Funcionamento</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-2">Dias Úteis</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Horário Inicial
                                    </label>
                                    <input
                                        type="time"
                                        className={inputClasses}
                                        value={settings.operatingHours.weekdays.start}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            operatingHours: {
                                                ...prev.operatingHours,
                                                weekdays: {
                                                    ...prev.operatingHours.weekdays,
                                                    start: e.target.value
                                                }
                                            }
                                        }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Horário Final
                                    </label>
                                    <input
                                        type="time"
                                        className={inputClasses}
                                        value={settings.operatingHours.weekdays.end}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            operatingHours: {
                                                ...prev.operatingHours,
                                                weekdays: {
                                                    ...prev.operatingHours.weekdays,
                                                    end: e.target.value
                                                }
                                            }
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Finais de Semana</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Horário Inicial
                                    </label>
                                    <input
                                        type="time"
                                        className={inputClasses}
                                        value={settings.operatingHours.weekends.start}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            operatingHours: {
                                                ...prev.operatingHours,
                                                weekends: {
                                                    ...prev.operatingHours.weekends,
                                                    start: e.target.value
                                                }
                                            }
                                        }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Horário Final
                                    </label>
                                    <input
                                        type="time"
                                        className={inputClasses}
                                        value={settings.operatingHours.weekends.end}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            operatingHours: {
                                                ...prev.operatingHours,
                                                weekends: {
                                                    ...prev.operatingHours.weekends,
                                                    end: e.target.value
                                                }
                                            }
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Dias de Funcionamento</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(settings.daysActive).map(([day, active]) => (
                            <label key={day} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        daysActive: {
                                            ...prev.daysActive,
                                            [day]: e.target.checked
                                        }
                                    }))}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 capitalize">
                                    {day}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}

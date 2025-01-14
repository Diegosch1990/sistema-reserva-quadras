function HoursSettings({ onSuccess, onError }) {
    const [hoursConfig, setHoursConfig] = React.useState({
        weekDays: {
            Segunda: true,
            Terça: true,
            Quarta: true,
            Quinta: true,
            Sexta: true,
            Sábado: false,
            Domingo: false
        },
        operatingHours: {
            start: '08:00',
            end: '22:00'
        },
        courtHours: {
            start: '09:00',
            end: '21:00'
        },
        intervals: {
            duration: 60,
            between: 0,
            maintenanceTime: 30
        }
    });

    React.useEffect(() => {
        loadHoursConfig();
    }, []);

    async function loadHoursConfig() {
        try {
            const response = await trickleListObjects('hours_config', 1, true);
            if (response.items && response.items.length > 0) {
                setHoursConfig(response.items[0].objectData);
            }
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao carregar configurações de horário');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await trickleListObjects('hours_config', 1, true);
            if (response.items && response.items.length > 0) {
                await trickleUpdateObject('hours_config', response.items[0].objectId, hoursConfig);
            } else {
                await trickleCreateObject('hours_config', hoursConfig);
            }
            onSuccess('Sucesso', 'Configurações de horário atualizadas com sucesso!');
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao salvar configurações de horário');
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Configurações de Horário</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Dias de Funcionamento</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.keys(hoursConfig.weekDays).map(day => (
                            <label key={day} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={hoursConfig.weekDays[day]}
                                    onChange={(e) => setHoursConfig({
                                        ...hoursConfig,
                                        weekDays: {
                                            ...hoursConfig.weekDays,
                                            [day]: e.target.checked
                                        }
                                    })}
                                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                                />
                                <span className="text-gray-700">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Horário do Estabelecimento</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Horário de Abertura
                            </label>
                            <input
                                type="time"
                                value={hoursConfig.operatingHours.start}
                                onChange={(e) => setHoursConfig({
                                    ...hoursConfig,
                                    operatingHours: {
                                        ...hoursConfig.operatingHours,
                                        start: e.target.value
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Horário de Fechamento
                            </label>
                            <input
                                type="time"
                                value={hoursConfig.operatingHours.end}
                                onChange={(e) => setHoursConfig({
                                    ...hoursConfig,
                                    operatingHours: {
                                        ...hoursConfig.operatingHours,
                                        end: e.target.value
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Horário das Quadras</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Início das Atividades
                            </label>
                            <input
                                type="time"
                                value={hoursConfig.courtHours.start}
                                onChange={(e) => setHoursConfig({
                                    ...hoursConfig,
                                    courtHours: {
                                        ...hoursConfig.courtHours,
                                        start: e.target.value
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Fim das Atividades
                            </label>
                            <input
                                type="time"
                                value={hoursConfig.courtHours.end}
                                onChange={(e) => setHoursConfig({
                                    ...hoursConfig,
                                    courtHours: {
                                        ...hoursConfig.courtHours,
                                        end: e.target.value
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Intervalos</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Duração da Reserva (min)
                            </label>
                            <input
                                type="number"
                                min="30"
                                step="30"
                                value={hoursConfig.intervals.duration}
                                onChange={(e) => setHoursConfig({
                                    ...hoursConfig,
                                    intervals: {
                                        ...hoursConfig.intervals,
                                        duration: parseInt(e.target.value)
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Intervalo entre Reservas (min)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="5"
                                value={hoursConfig.intervals.between}
                                onChange={(e) => setHoursConfig({
                                    ...hoursConfig,
                                    intervals: {
                                        ...hoursConfig.intervals,
                                        between: parseInt(e.target.value)
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tempo de Manutenção (min)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="5"
                                value={hoursConfig.intervals.maintenanceTime}
                                onChange={(e) => setHoursConfig({
                                    ...hoursConfig,
                                    intervals: {
                                        ...hoursConfig.intervals,
                                        maintenanceTime: parseInt(e.target.value)
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Salvar Configurações
                    </button>
                </div>
            </form>
        </div>
    );
}

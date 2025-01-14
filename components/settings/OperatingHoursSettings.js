function OperatingHoursSettings({ onSuccess, onError }) {
    const [operatingHours, setOperatingHours] = React.useState({
        days: {
            Segunda: true,
            Terça: true,
            Quarta: true,
            Quinta: true,
            Sexta: true,
            Sábado: false,
            Domingo: false
        },
        hours: {
            start: '08:00',
            end: '22:00'
        },
        intervals: {
            duration: 60,
            between: 0
        }
    });

    React.useEffect(() => {
        loadOperatingHours();
    }, []);

    async function loadOperatingHours() {
        try {
            const response = await trickleListObjects('operating_hours', 1, true);
            if (response.items && response.items.length > 0) {
                setOperatingHours(response.items[0].objectData);
            }
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao carregar horários de funcionamento');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await trickleListObjects('operating_hours', 1, true);
            if (response.items && response.items.length > 0) {
                await trickleUpdateObject('operating_hours', response.items[0].objectId, operatingHours);
            } else {
                await trickleCreateObject('operating_hours', operatingHours);
            }
            onSuccess('Sucesso', 'Horários de funcionamento atualizados com sucesso!');
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao atualizar horários de funcionamento');
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Horários de Funcionamento</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Dias de Funcionamento</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.keys(operatingHours.days).map(day => (
                            <label key={day} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={operatingHours.days[day]}
                                    onChange={(e) => setOperatingHours({
                                        ...operatingHours,
                                        days: {
                                            ...operatingHours.days,
                                            [day]: e.target.checked
                                        }
                                    })}
                                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                                />
                                <span>{day}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Horário de Funcionamento</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Horário de Abertura</label>
                            <input
                                type="time"
                                value={operatingHours.hours.start}
                                onChange={(e) => setOperatingHours({
                                    ...operatingHours,
                                    hours: {
                                        ...operatingHours.hours,
                                        start: e.target.value
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Horário de Fechamento</label>
                            <input
                                type="time"
                                value={operatingHours.hours.end}
                                onChange={(e) => setOperatingHours({
                                    ...operatingHours,
                                    hours: {
                                        ...operatingHours.hours,
                                        end: e.target.value
                                    }
                                })}
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Intervalos</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Duração do Horário (minutos)
                            </label>
                            <input
                                type="number"
                                value={operatingHours.intervals.duration}
                                onChange={(e) => setOperatingHours({
                                    ...operatingHours,
                                    intervals: {
                                        ...operatingHours.intervals,
                                        duration: parseInt(e.target.value)
                                    }
                                })}
                                min="30"
                                step="30"
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Intervalo entre Horários (minutos)
                            </label>
                            <input
                                type="number"
                                value={operatingHours.intervals.between}
                                onChange={(e) => setOperatingHours({
                                    ...operatingHours,
                                    intervals: {
                                        ...operatingHours.intervals,
                                        between: parseInt(e.target.value)
                                    }
                                })}
                                min="0"
                                step="5"
                                className="mt-1 block w-full h-12 px-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}

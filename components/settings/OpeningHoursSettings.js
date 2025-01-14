function OpeningHoursSettings({ onSuccess, onError }) {
    const [schedule, setSchedule] = React.useState({
        weekDays: {
            Segunda: { isOpen: true, start: '08:00', end: '22:00', breakStart: '12:00', breakEnd: '13:00' },
            Terça: { isOpen: true, start: '08:00', end: '22:00', breakStart: '12:00', breakEnd: '13:00' },
            Quarta: { isOpen: true, start: '08:00', end: '22:00', breakStart: '12:00', breakEnd: '13:00' },
            Quinta: { isOpen: true, start: '08:00', end: '22:00', breakStart: '12:00', breakEnd: '13:00' },
            Sexta: { isOpen: true, start: '08:00', end: '22:00', breakStart: '12:00', breakEnd: '13:00' },
            Sábado: { isOpen: false, start: '08:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
            Domingo: { isOpen: false, start: '08:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
        },
        holidays: {
            isOpen: false,
            start: '09:00',
            end: '17:00',
            breakStart: '12:00',
            breakEnd: '13:00'
        },
        specialDates: []
    });

    React.useEffect(() => {
        loadSchedule();
    }, []);

    async function loadSchedule() {
        try {
            const response = await safeListObjects('opening_hours', 1, true);
            if (response.length > 0) {
                setSchedule(response[0].objectData);
            }
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao carregar horários de funcionamento');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await safeListObjects('opening_hours', 1, true);
            if (response.length > 0) {
                await safeUpdateObject('opening_hours', response[0].objectId, schedule);
            } else {
                await safeCreateObject('opening_hours', schedule);
            }
            onSuccess('Sucesso', 'Horários de funcionamento atualizados com sucesso!');
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao salvar horários de funcionamento');
        }
    }

    function addSpecialDate() {
        setSchedule(prev => ({
            ...prev,
            specialDates: [...prev.specialDates, {
                date: '',
                description: '',
                isOpen: false,
                start: '09:00',
                end: '17:00',
                breakStart: '12:00',
                breakEnd: '13:00'
            }]
        }));
    }

    function removeSpecialDate(index) {
        setSchedule(prev => ({
            ...prev,
            specialDates: prev.specialDates.filter((_, i) => i !== index)
        }));
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Horário de Funcionamento</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dias da Semana */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Dias da Semana</h3>
                    <div className="space-y-4">
                        {Object.entries(schedule.weekDays).map(([day, config]) => (
                            <div key={day} className="grid grid-cols-6 gap-4 items-center p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center col-span-2">
                                    <input
                                        type="checkbox"
                                        checked={config.isOpen}
                                        onChange={(e) => setSchedule(prev => ({
                                            ...prev,
                                            weekDays: {
                                                ...prev.weekDays,
                                                [day]: { ...config, isOpen: e.target.checked }
                                            }
                                        }))}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                                    />
                                    <span className="font-medium">{day}</span>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600">Abertura</label>
                                    <input
                                        type="time"
                                        value={config.start}
                                        onChange={(e) => setSchedule(prev => ({
                                            ...prev,
                                            weekDays: {
                                                ...prev.weekDays,
                                                [day]: { ...config, start: e.target.value }
                                            }
                                        }))}
                                        disabled={!config.isOpen}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600">Início Intervalo</label>
                                    <input
                                        type="time"
                                        value={config.breakStart}
                                        onChange={(e) => setSchedule(prev => ({
                                            ...prev,
                                            weekDays: {
                                                ...prev.weekDays,
                                                [day]: { ...config, breakStart: e.target.value }
                                            }
                                        }))}
                                        disabled={!config.isOpen}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600">Fim Intervalo</label>
                                    <input
                                        type="time"
                                        value={config.breakEnd}
                                        onChange={(e) => setSchedule(prev => ({
                                            ...prev,
                                            weekDays: {
                                                ...prev.weekDays,
                                                [day]: { ...config, breakEnd: e.target.value }
                                            }
                                        }))}
                                        disabled={!config.isOpen}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600">Fechamento</label>
                                    <input
                                        type="time"
                                        value={config.end}
                                        onChange={(e) => setSchedule(prev => ({
                                            ...prev,
                                            weekDays: {
                                                ...prev.weekDays,
                                                [day]: { ...config, end: e.target.value }
                                            }
                                        }))}
                                        disabled={!config.isOpen}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feriados */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Feriados</h3>
                    <div className="grid grid-cols-6 gap-4 items-start">
                        <div className="col-span-2 flex items-center">
                            <input
                                type="checkbox"
                                checked={schedule.holidays.isOpen}
                                onChange={(e) => setSchedule(prev => ({
                                    ...prev,
                                    holidays: { ...prev.holidays, isOpen: e.target.checked }
                                }))}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                            />
                            <span className="font-medium">Aberto em feriados</span>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Abertura</label>
                            <input
                                type="time"
                                value={schedule.holidays.start}
                                onChange={(e) => setSchedule(prev => ({
                                    ...prev,
                                    holidays: { ...prev.holidays, start: e.target.value }
                                }))}
                                disabled={!schedule.holidays.isOpen}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Início Intervalo</label>
                            <input
                                type="time"
                                value={schedule.holidays.breakStart}
                                onChange={(e) => setSchedule(prev => ({
                                    ...prev,
                                    holidays: { ...prev.holidays, breakStart: e.target.value }
                                }))}
                                disabled={!schedule.holidays.isOpen}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Fim Intervalo</label>
                            <input
                                type="time"
                                value={schedule.holidays.breakEnd}
                                onChange={(e) => setSchedule(prev => ({
                                    ...prev,
                                    holidays: { ...prev.holidays, breakEnd: e.target.value }
                                }))}
                                disabled={!schedule.holidays.isOpen}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Fechamento</label>
                            <input
                                type="time"
                                value={schedule.holidays.end}
                                onChange={(e) => setSchedule(prev => ({
                                    ...prev,
                                    holidays: { ...prev.holidays, end: e.target.value }
                                }))}
                                disabled={!schedule.holidays.isOpen}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Datas Especiais */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Datas Especiais</h3>
                        <button
                            type="button"
                            onClick={addSpecialDate}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Adicionar Data
                        </button>
                    </div>
                    <div className="space-y-4">
                        {schedule.specialDates.map((specialDate, index) => (
                            <div key={index} className="grid grid-cols-7 gap-4 items-center p-4 border rounded-lg">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-600">Data</label>
                                    <input
                                        type="date"
                                        value={specialDate.date}
                                        onChange={(e) => {
                                            const newDates = [...schedule.specialDates];
                                            newDates[index] = { ...specialDate, date: e.target.value };
                                            setSchedule(prev => ({ ...prev, specialDates: newDates }));
                                        }}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-sm text-gray-600">Descrição</label>
                                    <input
                                        type="text"
                                        value={specialDate.description}
                                        onChange={(e) => {
                                            const newDates = [...schedule.specialDates];
                                            newDates[index] = { ...specialDate, description: e.target.value };
                                            setSchedule(prev => ({ ...prev, specialDates: newDates }));
                                        }}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm text-gray-600">Aberto</label>
                                    <input
                                        type="checkbox"
                                        checked={specialDate.isOpen}
                                        onChange={(e) => {
                                            const newDates = [...schedule.specialDates];
                                            newDates[index] = { ...specialDate, isOpen: e.target.checked };
                                            setSchedule(prev => ({ ...prev, specialDates: newDates }));
                                        }}
                                        className="mt-3 h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <button
                                        type="button"
                                        onClick={() => removeSpecialDate(index)}
                                        className="mt-6 text-red-600 hover:text-red-800"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}

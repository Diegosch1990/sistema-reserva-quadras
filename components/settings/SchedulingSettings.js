function SchedulingSettings({ onSuccess, onError }) {
    const [settings, setSettings] = React.useState({
        operatingHours: {
            weekdays: {
                start: '08:00',
                end: '22:00',
                breakStart: '12:00',
                breakEnd: '13:00'
            },
            weekends: {
                start: '09:00',
                end: '18:00',
                breakStart: '12:00',
                breakEnd: '13:00'
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
        },
        bookingRules: {
            maxBookingsPerDay: 1,
            minAdvanceHours: 24,
            maxAdvanceDays: 30,
            slotDuration: 60,
            breakBetweenSlots: 0,
            maintenanceTime: 30
        },
        holidays: {
            isOpen: false,
            start: '09:00',
            end: '17:00'
        },
        specialDates: []
    });

    React.useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const response = await safeListObjects('scheduling_settings', 1, true);
            if (response && response.length > 0) {
                setSettings(response[0].objectData);
            }
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao carregar configurações');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await safeListObjects('scheduling_settings', 1, true);
            if (response && response.length > 0) {
                await safeUpdateObject('scheduling_settings', response[0].objectId, settings);
            } else {
                await safeCreateObject('scheduling_settings', settings);
            }
            onSuccess('Sucesso', 'Configurações salvas com sucesso!');
        } catch (error) {
            reportError(error);
            onError('Erro', 'Erro ao salvar configurações');
        }
    }

    function addSpecialDate() {
        setSettings(prev => ({
            ...prev,
            specialDates: [...prev.specialDates, {
                date: '',
                description: '',
                isOpen: false,
                start: '09:00',
                end: '17:00'
            }]
        }));
    }

    function removeSpecialDate(index) {
        setSettings(prev => ({
            ...prev,
            specialDates: prev.specialDates.filter((_, i) => i !== index)
        }));
    }

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Operating Hours */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Horário de Funcionamento</h3>
                    
                    {/* Weekdays */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Dias Úteis</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">Abertura</label>
                                <input
                                    type="time"
                                    value={settings.operatingHours.weekdays.start}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        operatingHours: {
                                            ...settings.operatingHours,
                                            weekdays: {
                                                ...settings.operatingHours.weekdays,
                                                start: e.target.value
                                            }
                                        }
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Fechamento</label>
                                <input
                                    type="time"
                                    value={settings.operatingHours.weekdays.end}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        operatingHours: {
                                            ...settings.operatingHours,
                                            weekdays: {
                                                ...settings.operatingHours.weekdays,
                                                end: e.target.value
                                            }
                                        }
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Weekends */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Finais de Semana</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">Abertura</label>
                                <input
                                    type="time"
                                    value={settings.operatingHours.weekends.start}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        operatingHours: {
                                            ...settings.operatingHours,
                                            weekends: {
                                                ...settings.operatingHours.weekends,
                                                start: e.target.value
                                            }
                                        }
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Fechamento</label>
                                <input
                                    type="time"
                                    value={settings.operatingHours.weekends.end}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        operatingHours: {
                                            ...settings.operatingHours,
                                            weekends: {
                                                ...settings.operatingHours.weekends,
                                                end: e.target.value
                                            }
                                        }
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Days */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Dias de Funcionamento</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {Object.entries(settings.daysActive).map(([day, isActive]) => (
                                <label key={day} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            daysActive: {
                                                ...settings.daysActive,
                                                [day]: e.target.checked
                                            }
                                        })}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <span className="text-gray-700 capitalize">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Rules */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Regras de Agendamento</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Duração do Horário (minutos)
                            </label>
                            <input
                                type="number"
                                value={settings.bookingRules.slotDuration}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    bookingRules: {
                                        ...settings.bookingRules,
                                        slotDuration: parseInt(e.target.value)
                                    }
                                })}
                                min="30"
                                step="30"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Máximo de Reservas por Dia
                            </label>
                            <input
                                type="number"
                                value={settings.bookingRules.maxBookingsPerDay}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    bookingRules: {
                                        ...settings.bookingRules,
                                        maxBookingsPerDay: parseInt(e.target.value)
                                    }
                                })}
                                min="1"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Antecedência Mínima (horas)
                            </label>
                            <input
                                type="number"
                                value={settings.bookingRules.minAdvanceHours}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    bookingRules: {
                                        ...settings.bookingRules,
                                        minAdvanceHours: parseInt(e.target.value)
                                    }
                                })}
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Antecedência Máxima (dias)
                            </label>
                            <input
                                type="number"
                                value={settings.bookingRules.maxAdvanceDays}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    bookingRules: {
                                        ...settings.bookingRules,
                                        maxAdvanceDays: parseInt(e.target.value)
                                    }
                                })}
                                min="1"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Intervalo entre Horários (minutos)
                            </label>
                            <input
                                type="number"
                                value={settings.bookingRules.breakBetweenSlots}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    bookingRules: {
                                        ...settings.bookingRules,
                                        breakBetweenSlots: parseInt(e.target.value)
                                    }
                                })}
                                min="0"
                                step="5"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tempo de Manutenção (minutos)
                            </label>
                            <input
                                type="number"
                                value={settings.bookingRules.maintenanceTime}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    bookingRules: {
                                        ...settings.bookingRules,
                                        maintenanceTime: parseInt(e.target.value)
                                    }
                                })}
                                min="0"
                                step="5"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Holidays */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Feriados</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={settings.holidays.isOpen}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    holidays: {
                                        ...settings.holidays,
                                        isOpen: e.target.checked
                                    }
                                })}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="text-gray-700">Aberto em feriados</span>
                        </div>

                        {settings.holidays.isOpen && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">Abertura</label>
                                    <input
                                        type="time"
                                        value={settings.holidays.start}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            holidays: {
                                                ...settings.holidays,
                                                start: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600">Fechamento</label>
                                    <input
                                        type="time"
                                        value={settings.holidays.end}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            holidays: {
                                                ...settings.holidays,
                                                end: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special Dates */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Datas Especiais</h3>
                        <button
                            type="button"
                            onClick={addSpecialDate}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Adicionar Data
                        </button>
                    </div>

                    <div className="space-y-4">
                        {settings.specialDates.map((specialDate, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm text-gray-600">Data</label>
                                        <input
                                            type="date"
                                            value={specialDate.date}
                                            onChange={(e) => {
                                                const newDates = [...settings.specialDates];
                                                newDates[index] = {
                                                    ...specialDate,
                                                    date: e.target.value
                                                };
                                                setSettings({
                                                    ...settings,
                                                    specialDates: newDates
                                                });
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm text-gray-600">Descrição</label>
                                        <input
                                            type="text"
                                            value={specialDate.description}
                                            onChange={(e) => {
                                                const newDates = [...settings.specialDates];
                                                newDates[index] = {
                                                    ...specialDate,
                                                    description: e.target.value
                                                };
                                                setSettings({
                                                    ...settings,
                                                    specialDates: newDates
                                                });
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={specialDate.isOpen}
                                            onChange={(e) => {
                                                const newDates = [...settings.specialDates];
                                                newDates[index] = {
                                                    ...specialDate,
                                                    isOpen: e.target.checked
                                                };
                                                setSettings({
                                                    ...settings,
                                                    specialDates: newDates
                                                });
                                            }}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <span className="text-gray-700">Aberto</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => removeSpecialDate(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remover
                                    </button>
                                </div>

                                {specialDate.isOpen && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600">Abertura</label>
                                            <input
                                                type="time"
                                                value={specialDate.start}
                                                onChange={(e) => {
                                                    const newDates = [...settings.specialDates];
                                                    newDates[index] = {
                                                        ...specialDate,
                                                        start: e.target.value
                                                    };
                                                    setSettings({
                                                        ...settings,
                                                        specialDates: newDates
                                                    });
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Fechamento</label>
                                            <input
                                                type="time"
                                                value={specialDate.end}
                                                onChange={(e) => {
                                                    const newDates = [...settings.specialDates];
                                                    newDates[index] = {
                                                        ...specialDate,
                                                        end: e.target.value
                                                    };
                                                    setSettings({
                                                        ...settings,
                                                        specialDates: newDates
                                                    });
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Salvar Configurações
                    </button>
                </div>
            </form>
        </div>
    );
}

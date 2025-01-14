function SearchSystem({ onSearch }) {
    const [filters, setFilters] = React.useState({
        dateRange: {
            start: '',
            end: ''
        },
        court: '',
        customer: '',
        status: 'all'
    });

    const [searchTerm, setSearchTerm] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);

    function handleSearch() {
        onSearch({ ...filters, searchTerm });
    }

    function clearFilters() {
        setFilters({
            dateRange: {
                start: '',
                end: ''
            },
            court: '',
            customer: '',
            status: 'all'
        });
        setSearchTerm('');
        onSearch(null);
    }

    return (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg 
                            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200"
                >
                    <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
                        />
                    </svg>
                    Filtros
                </button>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Buscar
                </button>
            </div>

            {showFilters && (
                <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data Início</label>
                        <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={filters.dateRange.start}
                            onChange={(e) => setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, start: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data Fim</label>
                        <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={filters.dateRange.end}
                            onChange={(e) => setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, end: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quadra</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={filters.court}
                            onChange={(e) => setFilters({ ...filters, court: e.target.value })}
                        >
                            <option value="">Todas</option>
                            <option value="1">Quadra 1</option>
                            <option value="2">Quadra 2</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="cancelled">Cancelados</option>
                            <option value="completed">Concluídos</option>
                        </select>
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

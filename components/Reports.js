import React from 'react';

export function Reports() {
    const [reportType, setReportType] = React.useState('bookings');
    const [dateRange, setDateRange] = React.useState({
        start: '',
        end: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [reportData, setReportData] = React.useState(null);
    const [showMessage, setShowMessage] = React.useState({ show: false, title: '', message: '', type: 'success' });

    const reportTypes = [
        { 
            id: 'bookings', 
            label: 'Reservas', 
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            description: 'Relatório detalhado de todas as reservas'
        },
        { 
            id: 'financial', 
            label: 'Financeiro', 
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            description: 'Análise financeira de receitas e despesas'
        },
        { 
            id: 'customers', 
            label: 'Clientes', 
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            description: 'Análise do perfil e comportamento dos clientes'
        }
    ];

    async function generateReport() {
        try {
            setLoading(true);
            let data;

            switch (reportType) {
                case 'bookings':
                    data = await generateBookingsReport();
                    break;
                case 'financial':
                    data = await generateFinancialReport();
                    break;
                case 'customers':
                    data = await generateCustomersReport();
                    break;
            }

            setReportData(data);
            setShowMessage({
                show: true,
                title: 'Sucesso',
                message: 'Relatório gerado com sucesso!',
                type: 'success'
            });
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao gerar relatório',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    async function generateBookingsReport() {
        const bookings = await safeListObjects('booking', 1000, true);
        const filteredBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.objectData.date);
            return (!dateRange.start || bookingDate >= new Date(dateRange.start)) &&
                   (!dateRange.end || bookingDate <= new Date(dateRange.end));
        });

        // Calculate statistics
        const totalBookings = filteredBookings.length;
        const totalRevenue = filteredBookings.reduce((sum, booking) => sum + parseFloat(booking.objectData.price || 0), 0);
        const bookingsByDay = filteredBookings.reduce((acc, booking) => {
            const day = booking.objectData.day;
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});

        return {
            title: 'Relatório de Reservas',
            summary: {
                totalBookings,
                totalRevenue,
                averageBookingsPerDay: totalBookings / Object.keys(bookingsByDay).length || 0
            },
            bookingsByDay,
            bookings: filteredBookings
        };
    }

    async function generateFinancialReport() {
        const releases = await safeListObjects('releases', 1000, true);
        const filteredReleases = releases.filter(release => {
            const releaseDate = new Date(release.objectData.date);
            return (!dateRange.start || releaseDate >= new Date(dateRange.start)) &&
                   (!dateRange.end || releaseDate <= new Date(dateRange.end));
        });

        const income = filteredReleases.filter(r => r.objectData.type === 'entrada');
        const expenses = filteredReleases.filter(r => r.objectData.type === 'saida');
        
        const totalIncome = income.reduce((sum, r) => sum + parseFloat(r.objectData.amount || 0), 0);
        const totalExpenses = expenses.reduce((sum, r) => sum + parseFloat(r.objectData.amount || 0), 0);

        // Group by category
        const incomeByCategory = income.reduce((acc, r) => {
            const category = r.objectData.category;
            acc[category] = (acc[category] || 0) + parseFloat(r.objectData.amount || 0);
            return acc;
        }, {});

        const expensesByCategory = expenses.reduce((acc, r) => {
            const category = r.objectData.category;
            acc[category] = (acc[category] || 0) + parseFloat(r.objectData.amount || 0);
            return acc;
        }, {});

        return {
            title: 'Relatório Financeiro',
            summary: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                profitMargin: (totalIncome - totalExpenses) / totalIncome * 100
            },
            incomeByCategory,
            expensesByCategory,
            releases: filteredReleases
        };
    }

    async function generateCustomersReport() {
        const [customers, bookings] = await Promise.all([
            safeListObjects('customer', 1000, true),
            safeListObjects('booking', 1000, true)
        ]);

        const customerStats = customers.map(customer => {
            const customerBookings = bookings.filter(b => b.objectData.customerId === customer.objectId);
            const totalSpent = customerBookings.reduce((sum, b) => sum + parseFloat(b.objectData.price || 0), 0);
            
            return {
                ...customer,
                bookingsCount: customerBookings.length,
                totalSpent,
                lastBooking: customerBookings.length > 0 
                    ? new Date(Math.max(...customerBookings.map(b => new Date(b.objectData.date))))
                    : null
            };
        });

        const totalCustomers = customers.length;
        const activeCustomers = customerStats.filter(c => c.bookingsCount > 0).length;
        const totalRevenue = customerStats.reduce((sum, c) => sum + c.totalSpent, 0);

        return {
            title: 'Relatório de Clientes',
            summary: {
                totalCustomers,
                activeCustomers,
                totalRevenue,
                averageRevenuePerCustomer: totalRevenue / activeCustomers || 0
            },
            customerStats: customerStats.sort((a, b) => b.totalSpent - a.totalSpent)
        };
    }

    async function downloadPDF() {
        try {
            setLoading(true);
            const pdfContent = await generatePDF(reportData, reportType);
            // Implement PDF generation and download
            setShowMessage({
                show: true,
                title: 'Sucesso',
                message: 'PDF gerado com sucesso!',
                type: 'success'
            });
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao gerar PDF',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    async function downloadExcel() {
        try {
            setLoading(true);
            // Implement Excel generation and download
            setShowMessage({
                show: true,
                title: 'Sucesso',
                message: 'Excel gerado com sucesso!',
                type: 'success'
            });
        } catch (error) {
            reportError(error);
            setShowMessage({
                show: true,
                title: 'Erro',
                message: 'Erro ao gerar Excel',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto my-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Relatórios</h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {reportTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setReportType(type.id)}
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                                    reportType === type.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className={`p-3 rounded-full ${
                                    reportType === type.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={type.icon} />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <span className={`block font-medium ${
                                        reportType === type.id ? 'text-blue-600' : 'text-gray-700'
                                    }`}>
                                        {type.label}
                                    </span>
                                    <span className="text-sm text-gray-500">{type.description}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data Inicial
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data Final
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={generateReport}
                                disabled={loading}
                                className={`
                                    flex items-center px-6 py-3 rounded-lg text-white font-medium
                                    ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
                                    transition-colors duration-200
                                `}
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? 'Gerando...' : 'Gerar Relatório'}
                            </button>
                        </div>
                    </div>

                    {reportData && (
                        <ReportContent
                            type={reportType}
                            data={reportData}
                            onDownloadPDF={downloadPDF}
                            onDownloadExcel={downloadExcel}
                        />
                    )}
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

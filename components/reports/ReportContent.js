function ReportContent({ type, data, onDownloadPDF, onDownloadExcel }) {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
                <div className="flex space-x-3">
                    <button
                        onClick={onDownloadPDF}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        PDF
                    </button>
                    <button
                        onClick={onDownloadExcel}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Excel
                    </button>
                </div>
            </div>

            <div className="p-6">
                {type === 'bookings' && <BookingsReport data={data} />}
                {type === 'financial' && <FinancialReport data={data} />}
                {type === 'customers' && <CustomersReport data={data} />}
            </div>
        </div>
    );
}

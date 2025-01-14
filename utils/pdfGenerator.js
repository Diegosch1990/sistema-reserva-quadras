async function generatePDF(data, type) {
    try {
        const pdfContent = {
            content: [],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black'
                }
            }
        };

        // Cabeçalho do relatório
        pdfContent.content.push({
            text: `Relatório de ${type}`,
            style: 'header'
        });

        // Data do relatório
        pdfContent.content.push({
            text: `Gerado em: ${new Date().toLocaleString()}`,
            margin: [0, 0, 0, 20]
        });

        switch (type) {
            case 'reservas':
                addBookingsReport(pdfContent, data);
                break;
            case 'financeiro':
                addFinancialReport(pdfContent, data);
                break;
            case 'clientes':
                addCustomersReport(pdfContent, data);
                break;
        }

        // Aqui você pode usar uma biblioteca como pdfmake para gerar o PDF
        // const pdfDoc = pdfMake.createPdf(pdfContent);
        // pdfDoc.download(`relatorio_${type}_${new Date().toISOString()}.pdf`);

        return pdfContent;
    } catch (error) {
        reportError(error);
        console.error('Erro ao gerar PDF:', error);
        throw error;
    }
}

function addBookingsReport(pdfContent, bookings) {
    pdfContent.content.push({
        text: 'Resumo das Reservas',
        style: 'subheader'
    });

    const tableBody = [
        [
            { text: 'Data', style: 'tableHeader' },
            { text: 'Horário', style: 'tableHeader' },
            { text: 'Cliente', style: 'tableHeader' },
            { text: 'Quadra', style: 'tableHeader' },
            { text: 'Valor', style: 'tableHeader' }
        ]
    ];

    bookings.forEach(booking => {
        tableBody.push([
            booking.date,
            booking.time,
            booking.customerName,
            booking.courtName,
            `R$ ${booking.price.toFixed(2)}`
        ]);
    });

    pdfContent.content.push({
        table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', 'auto'],
            body: tableBody
        },
        layout: 'lightHorizontalLines'
    });
}

function addFinancialReport(pdfContent, financial) {
    pdfContent.content.push({
        text: 'Resumo Financeiro',
        style: 'subheader'
    });

    const totalIncome = financial.income.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = financial.expenses.reduce((acc, curr) => acc + curr.amount, 0);

    pdfContent.content.push({
        columns: [
            {
                width: '*',
                text: [
                    { text: 'Receita Total: ', bold: true },
                    `R$ ${totalIncome.toFixed(2)}`
                ]
            },
            {
                width: '*',
                text: [
                    { text: 'Despesas Totais: ', bold: true },
                    `R$ ${totalExpenses.toFixed(2)}`
                ]
            },
            {
                width: '*',
                text: [
                    { text: 'Saldo: ', bold: true },
                    `R$ ${(totalIncome - totalExpenses).toFixed(2)}`
                ]
            }
        ],
        margin: [0, 0, 0, 20]
    });
}

function addCustomersReport(pdfContent, customers) {
    pdfContent.content.push({
        text: 'Relatório de Clientes',
        style: 'subheader'
    });

    const tableBody = [
        [
            { text: 'Nome', style: 'tableHeader' },
            { text: 'Contato', style: 'tableHeader' },
            { text: 'Reservas', style: 'tableHeader' },
            { text: 'Valor Total', style: 'tableHeader' }
        ]
    ];

    customers.forEach(customer => {
        tableBody.push([
            customer.name,
            customer.contact,
            customer.bookingsCount.toString(),
            `R$ ${customer.totalSpent.toFixed(2)}`
        ]);
    });

    pdfContent.content.push({
        table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: tableBody
        },
        layout: 'lightHorizontalLines'
    });
}

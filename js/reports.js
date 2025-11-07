// Módulo de generación de reportes
const Reports = {
    // Generar reporte de discrepancias
    generateDiscrepanciesReport: function() {
        const summary = Inventory.generateSummary();
        return summary;
    },

    // Exportar reporte
    exportReport: function() {
        const report = this.generateDiscrepanciesReport();
        
        // Crear contenido CSV
        let csvContent = "Código,Descripción,Teórico,Físico,Diferencia\n";
        
        report.discrepanciesList.forEach(item => {
            csvContent += `"${item.code}","${item.description}",${item.theoretical},${item.physical},${item.difference}\n`;
        });

        // Crear y descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `inventario_${Inventory.current.store}_${Inventory.current.date}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Mostrar reporte en la UI
    displayReport: function() {
        const report = this.generateDiscrepanciesReport();
        const discrepanciesBody = document.getElementById('discrepancies-body');
        
        // Actualizar resumen
        document.getElementById('report-theoretical').textContent = report.theoretical;
        document.getElementById('report-physical').textContent = report.physical;
        document.getElementById('report-discrepancies').textContent = report.discrepancies;
        
        // Limpiar tabla
        discrepanciesBody.innerHTML = '';
        
        // Llenar tabla con discrepancias
        report.discrepanciesList.forEach(item => {
            const row = document.createElement('tr');
            row.className = item.difference > 0 ? 'discrepancy-high' : 'discrepancy-low';
            
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.description}</td>
                <td>${item.theoretical}</td>
                <td>${item.physical}</td>
                <td>${item.difference > 0 ? '+' : ''}${item.difference}</td>
            `;
            
            discrepanciesBody.appendChild(row);
        });
    }
};
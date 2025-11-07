// Aplicación principal
const App = {
    // Inicializar aplicación
    init: function() {
        // Inicializar módulos
        Inventory.init();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Inicializar UI
        this.updateUI();
        
        // Inicializar escáner
        Scanner.init(
            document.getElementById('barcode-input'),
            this.handleScanResult
        );
    },

    // Configurar event listeners
    setupEventListeners: function() {
        // Navegación por pestañas
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.activateTab(tab.getAttribute('data-tab'));
            });
        });

        // Guardar información del inventario
        document.getElementById('save-inventory-info').addEventListener('click', () => {
            this.saveInventoryInfo();
        });

        // Cargar inventario teórico
        document.getElementById('load-theoretical').addEventListener('click', () => {
            this.loadTheoreticalInventory();
        });

        // Finalizar inventario
        document.getElementById('finish-inventory').addEventListener('click', () => {
            this.finishInventory();
        });

        // Exportar reporte
        document.getElementById('export-report').addEventListener('click', () => {
            Reports.exportReport();
        });
    },

    // Activar pestaña
    activateTab: function(tabId) {
        // Actualizar pestañas
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
        });

        // Actualizar contenidos
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

        // Acciones específicas por pestaña
        if (tabId === 'report') {
            Reports.displayReport();
        } else if (tabId === 'scan') {
            document.getElementById('barcode-input').focus();
        }
    },

    // Guardar información del inventario
    saveInventoryInfo: function() {
        const store = document.getElementById('store').value;
        const date = document.getElementById('date').value;
        const responsible = document.getElementById('responsible').value;

        if (!store || !date || !responsible) {
            alert('Por favor, complete todos los campos de información del inventario.');
            return;
        }

        if (Inventory.saveInfo(store, date, responsible)) {
            this.updateCurrentInventoryInfo();
            alert('Información del inventario guardada correctamente.');
        }
    },

    // Cargar inventario teórico
    loadTheoreticalInventory: function() {
        const fileInput = document.getElementById('excel-file');
        
        if (!fileInput.files.length) {
            alert('Por favor, seleccione un archivo Excel.');
            return;
        }

        // Simulación de carga de Excel
        // En producción, integrar con SheetJS u otra librería
        const sampleData = [
            { code: '1001', description: 'Producto A', quantity: 10 },
            { code: '1002', description: 'Producto B', quantity: 15 },
            { code: '1003', description: 'Producto C', quantity: 20 },
            { code: '1004', description: 'Producto D', quantity: 5 },
            { code: '1005', description: 'Producto E', quantity: 8 },
            { code: '1006', description: 'Producto F', quantity: 12 },
            { code: '1007', description: 'Producto G', quantity: 7 },
            { code: '1008', description: 'Producto H', quantity: 25 },
            { code: '1009', description: 'Producto I', quantity: 3 },
            { code: '1010', description: 'Producto J', quantity: 18 }
        ];

        if (Inventory.loadTheoretical(sampleData)) {
            this.updateInventoryCounts();
            alert('Inventario teórico cargado correctamente.');
        }
    },

    // Manejar resultado del escaneo
    handleScanResult: function(result) {
        if (!result.success) {
            alert(result.message);
        } else {
            App.updateInventoryCounts();
        }
    },

    // Finalizar inventario
    finishInventory: function() {
        if (!Inventory.current.store || !Inventory.current.date || !Inventory.current.responsible) {
            alert('Por favor, complete la información del inventario antes de finalizar.');
            return;
        }

        if (Inventory.theoretical.length === 0) {
            alert('Por favor, cargue el inventario teórico antes de finalizar.');
            return;
        }

        const record = Inventory.finish();
        this.updateInventoryCounts();
        this.updateHistoryList();
        
        alert('Inventario finalizado correctamente. Puede ver el informe en la pestaña correspondiente.');
        this.activateTab('report');
    },

    // Actualizar información del inventario actual
    updateCurrentInventoryInfo: function() {
        document.getElementById('current-store').textContent = `Tienda: ${Inventory.current.store}`;
        document.getElementById('current-date').textContent = `Fecha: ${this.formatDate(Inventory.current.date)}`;
        document.getElementById('current-responsible').textContent = `Responsable: ${Inventory.current.responsible}`;
    },

    // Actualizar contadores de inventario
    updateInventoryCounts: function() {
        const stats = Inventory.getStats();
        
        document.getElementById('theoretical-count').textContent = stats.theoretical;
        document.getElementById('physical-count').textContent = stats.physical;
        document.getElementById('discrepancies-count').textContent = stats.discrepancies;
    },

    // Actualizar lista de historial
    updateHistoryList: function() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        Inventory.history.forEach(inventory => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-date">${this.formatDate(inventory.date)}</div>
                <div class="history-store">${inventory.store}</div>
                <div class="history-responsible">Responsable: ${inventory.responsible}</div>
                <div style="margin-top: 10px;">
                    <button class="view-inventory" data-timestamp="${inventory.timestamp}">Ver Detalles</button>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // Agregar event listeners a los botones de ver detalles
        document.querySelectorAll('.view-inventory').forEach(button => {
            button.addEventListener('click', (e) => {
                const timestamp = e.target.getAttribute('data-timestamp');
                this.viewInventoryDetails(timestamp);
            });
        });
    },

    // Ver detalles de inventario del historial
    viewInventoryDetails: function(timestamp) {
        const inventory = Inventory.history.find(item => item.timestamp === timestamp);
        
        if (inventory) {
            // Cargar este inventario en la memoria actual para visualización
            Inventory.theoretical = inventory.theoretical;
            Inventory.physical = inventory.physical;
            Inventory.current = {
                store: inventory.store,
                date: inventory.date,
                responsible: inventory.responsible
            };
            
            this.updateUI();
            this.activateTab('report');
            alert(`Mostrando inventario de ${inventory.store} del ${this.formatDate(inventory.date)}`);
        }
    },

    // Formatear fecha
    formatDate: function(dateString) {
        if (!dateString) return '--/--/----';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    },

    // Actualizar UI completa
    updateUI: function() {
        this.updateCurrentInventoryInfo();
        this.updateInventoryCounts();
        this.updateHistoryList();
    }
};

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
// Módulo de gestión de inventario
const Inventory = {
    theoretical: [],
    physical: {},
    current: {
        store: '',
        date: '',
        responsible: ''
    },
    history: [],

    // Inicializar inventario
    init: function() {
        this.loadFromStorage();
    },

    // Guardar información del inventario
    saveInfo: function(store, date, responsible) {
        this.current = { store, date, responsible };
        this.saveToStorage();
        return true;
    },

    // Cargar inventario teórico
    loadTheoretical: function(data) {
        this.theoretical = data;
        this.saveToStorage();
        return true;
    },

    // Agregar producto al inventario físico
    addPhysical: function(barcode) {
        const product = this.theoretical.find(item => item.code === barcode);
        
        if (!product) {
            return { success: false, message: 'Producto no encontrado en inventario teórico' };
        }

        if (this.physical[barcode]) {
            this.physical[barcode]++;
        } else {
            this.physical[barcode] = 1;
        }

        this.saveToStorage();
        return { success: true, product };
    },

    // Finalizar inventario
    finish: function() {
        const inventoryRecord = {
            ...this.current,
            theoretical: [...this.theoretical],
            physical: {...this.physical},
            timestamp: new Date().toISOString(),
            summary: this.generateSummary()
        };

        this.history.unshift(inventoryRecord);
        
        // Mantener solo los últimos 5 registros
        if (this.history.length > 5) {
            this.history = this.history.slice(0, 5);
        }

        // Limpiar inventario físico para nuevo conteo
        this.physical = {};
        this.saveToStorage();

        return inventoryRecord;
    },

    // Generar resumen del inventario
    generateSummary: function() {
        let discrepancies = 0;
        const discrepanciesList = [];

        this.theoretical.forEach(item => {
            const physicalQuantity = this.physical[item.code] || 0;
            const difference = physicalQuantity - item.quantity;
            
            if (difference !== 0) {
                discrepancies++;
                discrepanciesList.push({
                    code: item.code,
                    description: item.description,
                    theoretical: item.quantity,
                    physical: physicalQuantity,
                    difference: difference
                });
            }
        });

        return {
            theoretical: this.theoretical.length,
            physical: Object.keys(this.physical).length,
            discrepancies: discrepancies,
            discrepanciesList: discrepanciesList
        };
    },

    // Obtener estadísticas actuales
    getStats: function() {
        let discrepancies = 0;
        this.theoretical.forEach(item => {
            const physicalCount = this.physical[item.code] || 0;
            if (physicalCount !== item.quantity) {
                discrepancies++;
            }
        });

        return {
            theoretical: this.theoretical.length,
            physical: Object.keys(this.physical).length,
            discrepancies: discrepancies
        };
    },

    // Guardar en localStorage
    saveToStorage: function() {
        Storage.save('theoreticalInventory', this.theoretical);
        Storage.save('physicalInventory', this.physical);
        Storage.save('currentInventory', this.current);
        Storage.save('inventoryHistory', this.history);
    },

    // Cargar desde localStorage
    loadFromStorage: function() {
        this.theoretical = Storage.load('theoreticalInventory') || [];
        this.physical = Storage.load('physicalInventory') || {};
        this.current = Storage.load('currentInventory') || { store: '', date: '', responsible: '' };
        this.history = Storage.load('inventoryHistory') || [];
    }
};
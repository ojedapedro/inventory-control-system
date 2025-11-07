// Módulo de escaneo de códigos de barras
const Scanner = {
    input: null,
    callback: null,

    // Inicializar escáner
    init: function(inputElement, callback) {
        this.input = inputElement;
        this.callback = callback;
        
        this.setupEventListeners();
    },

    // Configurar event listeners
    setupEventListeners: function() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processBarcode(this.input.value);
                this.input.value = '';
            }
        });

        // Auto-enfocar el campo de escaneo
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.input.focus(), 100);
        });

        // Enfocar automáticamente al cargar
        window.addEventListener('load', () => {
            this.input.focus();
        });
    },

    // Procesar código de barras
    processBarcode: function(barcode) {
        if (!barcode || barcode.trim() === '') return;

        const result = Inventory.addPhysical(barcode.trim());
        
        if (this.callback) {
            this.callback(result);
        }
    },

    // Habilitar/deshabilitar escáner
    setEnabled: function(enabled) {
        this.input.disabled = !enabled;
        if (enabled) {
            this.input.focus();
        }
    }
};
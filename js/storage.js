// Módulo de almacenamiento local
const Storage = {
    // Guardar datos en localStorage
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error guardando en localStorage:', e);
            return false;
        }
    },

    // Cargar datos desde localStorage
    load: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error cargando desde localStorage:', e);
            return null;
        }
    },

    // Eliminar datos de localStorage
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error eliminando de localStorage:', e);
            return false;
        }
    },

    // Limpiar todos los datos
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error limpiando localStorage:', e);
            return false;
        }
    }
};
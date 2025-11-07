// En inventory.js - loadTheoretical method
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    
    // Procesar jsonData según la estructura esperada
    Inventory.loadTheoretical(jsonData);
};

reader.readAsArrayBuffer(file);
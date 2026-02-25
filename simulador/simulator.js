// Global state
let productos = [];
let bancos = [];
let tasas = [];
let currentResults = [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    populateProductos();
    setupEventListeners();
});

// Load data from API
async function loadData() {
    try {
        // Load productos
        const productosRes = await fetch('tables/productos?limit=100');
        const productosData = await productosRes.json();
        productos = productosData.data.filter(p => p.activo);

        // Load bancos
        const bancosRes = await fetch('tables/bancos?limit=100');
        const bancosData = await bancosRes.json();
        bancos = bancosData.data.filter(b => b.activo).sort((a, b) => a.orden - b.orden);

        // Load tasas
        const tasasRes = await fetch('tables/tasas?limit=1000');
        const tasasData = await tasasRes.json();
        tasas = tasasData.data.filter(t => t.disponible);

        console.log('Data loaded:', { productos: productos.length, bancos: bancos.length, tasas: tasas.length });
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error al cargar datos. Por favor, recargue la página.');
    }
}

// Populate productos dropdown
function populateProductos() {
    const select = document.getElementById('producto');
    select.innerHTML = '<option value="">Seleccione un producto</option>';
    
    productos.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.id;
        option.textContent = prod.nombre;
        select.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('simulatorForm');
    form.addEventListener('submit', handleSimulation);

    // Auto-calculate monto a financiar
    document.getElementById('valorInmueble').addEventListener('input', calculateMontoFinanciar);
    document.getElementById('cuotaInicial').addEventListener('input', calculateMontoFinanciar);
}

// Calculate monto a financiar
function calculateMontoFinanciar() {
    const valorInmueble = parseFloat(document.getElementById('valorInmueble').value) || 0;
    const cuotaInicial = parseFloat(document.getElementById('cuotaInicial').value) || 0;
    
    const montoCuota = valorInmueble * (cuotaInicial / 100);
    const montoFinanciar = valorInmueble - montoCuota;
    
    document.getElementById('montoCuotaInicial').textContent = formatCurrency(montoCuota);
    document.getElementById('montoFinanciar').value = montoFinanciar;
}

// Handle simulation
async function handleSimulation(e) {
    e.preventDefault();
    
    const productoId = document.getElementById('producto').value;
    const tipoVivienda = document.getElementById('tipoVivienda').value;
    const valorInmueble = parseFloat(document.getElementById('valorInmueble').value);
    const cuotaInicial = parseFloat(document.getElementById('cuotaInicial').value);
    const montoFinanciar = parseFloat(document.getElementById('montoFinanciar').value);
    const plazoAnios = parseInt(document.getElementById('plazoAnios').value);

    if (!productoId || !tipoVivienda || !valorInmueble || !montoFinanciar) {
        alert('Por favor complete todos los campos requeridos.');
        return;
    }

    // Filter tasas for selected product and tipo vivienda
    const tasasAplicables = tasas.filter(t => 
        t.producto_id === productoId && 
        t.tipo_vivienda === tipoVivienda &&
        t.disponible
    );

    if (tasasAplicables.length === 0) {
        alert('No hay tasas disponibles para esta combinación de producto y tipo de vivienda.');
        return;
    }

    // Calculate results for each bank
    currentResults = [];
    
    tasasAplicables.forEach(tasa => {
        const banco = bancos.find(b => b.id === tasa.banco_id);
        if (!banco) return;

        // Use average rate (or min/max as option)
        const tasaEA = (tasa.tasa_ea_min + tasa.tasa_ea_max) / 2;
        const tasaMV = eaToMv(tasaEA);
        
        // Calculate monthly payment using French system
        const cuotaMensual = calcularCuotaFrancesa(montoFinanciar, tasaMV, plazoAnios * 12);
        const totalPagado = cuotaMensual * plazoAnios * 12;
        const interesesTotales = totalPagado - montoFinanciar;

        currentResults.push({
            banco: banco.nombre,
            bancoId: banco.id,
            tasaEA: tasaEA,
            tasaMV: tasaMV,
            cuotaMensual: cuotaMensual,
            totalPagado: totalPagado,
            interesesTotales: interesesTotales,
            orden: banco.orden
        });
    });

    // Sort by cuota mensual (ascending)
    currentResults.sort((a, b) => a.cuotaMensual - b.cuotaMensual);

    // Display results
    displayResults(productoId, tipoVivienda, valorInmueble, cuotaInicial, montoFinanciar, plazoAnios);
}

// Calculate French system monthly payment
// Formula: C = P * (i(1+i)^n) / ((1+i)^n - 1)
function calcularCuotaFrancesa(principal, tasaMensual, numeroCuotas) {
    const i = tasaMensual / 100;
    const numerador = i * Math.pow(1 + i, numeroCuotas);
    const denominador = Math.pow(1 + i, numeroCuotas) - 1;
    return principal * (numerador / denominador);
}

// Convert EA (Tasa Efectiva Anual) to MV (Tasa Mensual Vencida)
function eaToMv(tasaEA) {
    // Formula: MV = ((1 + EA)^(1/12) - 1) * 100
    return (Math.pow(1 + (tasaEA / 100), 1 / 12) - 1) * 100;
}

// Display results
function displayResults(productoId, tipoVivienda, valorInmueble, cuotaInicial, montoFinanciar, plazoAnios) {
    // Update simulation parameters
    const producto = productos.find(p => p.id === productoId);
    document.getElementById('paramProducto').textContent = producto.nombre;
    document.getElementById('paramTipo').textContent = tipoVivienda === 'VIS' ? 'VIS' : 'NO VIS';
    document.getElementById('paramValor').textContent = formatCurrency(valorInmueble);
    document.getElementById('paramCuota').textContent = cuotaInicial + '%';
    document.getElementById('paramMonto').textContent = formatCurrency(montoFinanciar);
    document.getElementById('paramPlazo').textContent = plazoAnios + ' años';

    // Update summary cards
    const bestResult = currentResults[0];
    const worstResult = currentResults[currentResults.length - 1];
    
    document.getElementById('bestQuota').textContent = formatCurrency(bestResult.cuotaMensual);
    document.getElementById('bestRate').textContent = bestResult.tasaEA.toFixed(2) + '%';
    document.getElementById('totalBanks').textContent = currentResults.length;
    document.getElementById('savingsRange').textContent = formatCurrency(
        (worstResult.cuotaMensual - bestResult.cuotaMensual) * plazoAnios * 12
    );

    // Populate table
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';

    currentResults.forEach((result, index) => {
        const ahorro = worstResult.cuotaMensual - result.cuotaMensual;
        const ahorroTotal = ahorro * plazoAnios * 12;
        
        const row = document.createElement('tr');
        row.className = index === 0 ? 'bg-green-50 border-l-4 border-green-500' : 
                        index === currentResults.length - 1 ? 'bg-red-50 border-l-4 border-red-500' : '';
        
        row.innerHTML = `
            <td class="px-6 py-4 font-bold text-gray-700">
                ${index === 0 ? '<i class="fas fa-trophy text-yellow-500 mr-2"></i>' : ''}
                #${index + 1}
            </td>
            <td class="px-6 py-4 font-semibold text-gray-800">${result.banco}</td>
            <td class="px-6 py-4 text-right">${result.tasaEA.toFixed(2)}%</td>
            <td class="px-6 py-4 text-right">${result.tasaMV.toFixed(4)}%</td>
            <td class="px-6 py-4 text-right font-bold text-purple-600">${formatCurrency(result.cuotaMensual)}</td>
            <td class="px-6 py-4 text-right">${formatCurrency(result.totalPagado)}</td>
            <td class="px-6 py-4 text-right text-red-600">${formatCurrency(result.interesesTotales)}</td>
            <td class="px-6 py-4 text-right text-green-600 font-semibold no-print">
                ${ahorroTotal > 0 ? '+' + formatCurrency(ahorroTotal) : '-'}
            </td>
        `;
        
        tbody.appendChild(row);
    });

    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

    // Generate scenario comparison
    generateScenarioComparison(montoFinanciar);
}

// Generate multi-scenario comparison
function generateScenarioComparison(montoFinanciar) {
    const plazos = [15, 20, 30];
    const scenarioDiv = document.getElementById('scenarioComparison');
    scenarioDiv.innerHTML = '';

    const bestBank = currentResults[0];

    plazos.forEach(plazo => {
        const cuotaMensual = calcularCuotaFrancesa(montoFinanciar, bestBank.tasaMV, plazo * 12);
        const totalPagado = cuotaMensual * plazo * 12;
        const interesesTotales = totalPagado - montoFinanciar;

        const card = document.createElement('div');
        card.className = 'bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border-2 border-purple-200';
        card.innerHTML = `
            <h3 class="text-xl font-bold text-purple-700 mb-4">
                <i class="fas fa-calendar mr-2"></i>${plazo} Años
            </h3>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">Cuota Mensual:</span>
                    <span class="font-bold text-gray-800">${formatCurrency(cuotaMensual)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Total a Pagar:</span>
                    <span class="font-semibold text-gray-800">${formatCurrency(totalPagado)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Intereses:</span>
                    <span class="font-semibold text-red-600">${formatCurrency(interesesTotales)}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-purple-200">
                    <span class="text-gray-600">Banco:</span>
                    <span class="font-semibold text-purple-700">${bestBank.banco}</span>
                </div>
            </div>
        `;
        scenarioDiv.appendChild(card);
    });
}

// Sort table
function sortTable(criteria) {
    if (criteria === 'cuota') {
        currentResults.sort((a, b) => a.cuotaMensual - b.cuotaMensual);
    } else if (criteria === 'tasa') {
        currentResults.sort((a, b) => a.tasaEA - b.tasaEA);
    }
    
    // Re-render table without recalculating
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    const plazoAnios = parseInt(document.getElementById('plazoAnios').value);
    const worstResult = currentResults[currentResults.length - 1];
    
    currentResults.forEach((result, index) => {
        const ahorro = worstResult.cuotaMensual - result.cuotaMensual;
        const ahorroTotal = ahorro * plazoAnios * 12;
        
        const row = document.createElement('tr');
        row.className = index === 0 ? 'bg-green-50 border-l-4 border-green-500' : 
                        index === currentResults.length - 1 ? 'bg-red-50 border-l-4 border-red-500' : '';
        
        row.innerHTML = `
            <td class="px-6 py-4 font-bold text-gray-700">
                ${index === 0 ? '<i class="fas fa-trophy text-yellow-500 mr-2"></i>' : ''}
                #${index + 1}
            </td>
            <td class="px-6 py-4 font-semibold text-gray-800">${result.banco}</td>
            <td class="px-6 py-4 text-right">${result.tasaEA.toFixed(2)}%</td>
            <td class="px-6 py-4 text-right">${result.tasaMV.toFixed(4)}%</td>
            <td class="px-6 py-4 text-right font-bold text-purple-600">${formatCurrency(result.cuotaMensual)}</td>
            <td class="px-6 py-4 text-right">${formatCurrency(result.totalPagado)}</td>
            <td class="px-6 py-4 text-right text-red-600">${formatCurrency(result.interesesTotales)}</td>
            <td class="px-6 py-4 text-right text-green-600 font-semibold no-print">
                ${ahorroTotal > 0 ? '+' + formatCurrency(ahorroTotal) : '-'}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Export to PDF
function exportToPDF() {
    window.print();
}

// Utility: Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

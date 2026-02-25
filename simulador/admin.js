// Global state
let bancos = [];
let productos = [];
let tasas = [];
let allTasas = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllData();
    renderBancos();
    switchTab('bancos');
});

// Load all data
async function loadAllData() {
    try {
        const [bancosRes, productosRes, tasasRes] = await Promise.all([
            fetch('tables/bancos?limit=100'),
            fetch('tables/productos?limit=100'),
            fetch('tables/tasas?limit=1000')
        ]);

        const bancosData = await bancosRes.json();
        const productosData = await productosRes.json();
        const tasasData = await tasasRes.json();

        bancos = bancosData.data.sort((a, b) => a.orden - b.orden);
        productos = productosData.data;
        tasas = tasasData.data;
        allTasas = [...tasas];

        console.log('Admin data loaded:', { bancos: bancos.length, productos: productos.length, tasas: tasas.length });
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error al cargar datos.');
    }
}

// Switch tabs
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('tab-active');
    });
    document.getElementById(`tab-${tab}`).classList.add('tab-active');

    // Show/hide sections
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(`section-${tab}`).classList.remove('hidden');

    // Render data
    if (tab === 'bancos') renderBancos();
    if (tab === 'productos') renderProductos();
    if (tab === 'tasas') {
        populateFilters();
        renderTasas();
    }
}

// ===== BANCOS =====

function renderBancos() {
    const tbody = document.getElementById('bancosTableBody');
    tbody.innerHTML = '';

    bancos.forEach(banco => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-4 py-3">${banco.orden}</td>
            <td class="px-4 py-3 font-semibold">${banco.nombre}</td>
            <td class="px-4 py-3 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${banco.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                    ${banco.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="px-4 py-3 text-center">
                <button onclick="editBanco('${banco.id}')" class="text-blue-600 hover:text-blue-800 mx-1">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="toggleBancoStatus('${banco.id}')" class="text-${banco.activo ? 'red' : 'green'}-600 hover:text-${banco.activo ? 'red' : 'green'}-800 mx-1">
                    <i class="fas fa-${banco.activo ? 'toggle-off' : 'toggle-on'}"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddBancoModal() {
    showModal(`
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Agregar Banco</h3>
            <form id="addBancoForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Banco</label>
                    <input type="text" id="bancoNombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Orden de Presentación</label>
                    <input type="number" id="bancoOrden" required value="${bancos.length + 1}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="bancoActivo" checked class="w-4 h-4 text-purple-600 mr-2">
                    <label class="text-sm font-semibold text-gray-700">Activo</label>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="hideModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    `);

    document.getElementById('addBancoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('bancoNombre').value;
        const orden = parseInt(document.getElementById('bancoOrden').value);
        const activo = document.getElementById('bancoActivo').checked;

        try {
            const response = await fetch('tables/bancos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, orden, activo })
            });

            if (response.ok) {
                await loadAllData();
                renderBancos();
                hideModal();
                alert('Banco agregado exitosamente');
            }
        } catch (error) {
            console.error('Error adding banco:', error);
            alert('Error al agregar banco');
        }
    });
}

async function editBanco(bancoId) {
    const banco = bancos.find(b => b.id === bancoId);
    if (!banco) return;

    showModal(`
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Editar Banco</h3>
            <form id="editBancoForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Banco</label>
                    <input type="text" id="bancoNombre" required value="${banco.nombre}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Orden de Presentación</label>
                    <input type="number" id="bancoOrden" required value="${banco.orden}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="bancoActivo" ${banco.activo ? 'checked' : ''} class="w-4 h-4 text-purple-600 mr-2">
                    <label class="text-sm font-semibold text-gray-700">Activo</label>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="hideModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    `);

    document.getElementById('editBancoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('bancoNombre').value;
        const orden = parseInt(document.getElementById('bancoOrden').value);
        const activo = document.getElementById('bancoActivo').checked;

        try {
            const response = await fetch(`tables/bancos/${banco.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, orden, activo })
            });

            if (response.ok) {
                await loadAllData();
                renderBancos();
                hideModal();
                alert('Banco actualizado exitosamente');
            }
        } catch (error) {
            console.error('Error updating banco:', error);
            alert('Error al actualizar banco');
        }
    });
}

async function toggleBancoStatus(bancoId) {
    const banco = bancos.find(b => b.id === bancoId);
    if (!banco) return;

    try {
        const response = await fetch(`tables/bancos/${banco.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !banco.activo })
        });

        if (response.ok) {
            await loadAllData();
            renderBancos();
        }
    } catch (error) {
        console.error('Error toggling banco:', error);
    }
}

// ===== PRODUCTOS =====

function renderProductos() {
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = '';

    productos.forEach(prod => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-4 py-3 font-mono text-sm">${prod.codigo}</td>
            <td class="px-4 py-3 font-semibold">${prod.nombre}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${prod.descripcion}</td>
            <td class="px-4 py-3 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${prod.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                    ${prod.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="px-4 py-3 text-center">
                <button onclick="editProducto('${prod.id}')" class="text-blue-600 hover:text-blue-800 mx-1">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="toggleProductoStatus('${prod.id}')" class="text-${prod.activo ? 'red' : 'green'}-600 hover:text-${prod.activo ? 'red' : 'green'}-800 mx-1">
                    <i class="fas fa-${prod.activo ? 'toggle-off' : 'toggle-on'}"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddProductoModal() {
    showModal(`
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Agregar Producto</h3>
            <form id="addProductoForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Código</label>
                    <input type="text" id="productoCodigo" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                    <input type="text" id="productoNombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                    <textarea id="productoDescripcion" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"></textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="productoActivo" checked class="w-4 h-4 text-purple-600 mr-2">
                    <label class="text-sm font-semibold text-gray-700">Activo</label>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="hideModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    `);

    document.getElementById('addProductoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const codigo = document.getElementById('productoCodigo').value;
        const nombre = document.getElementById('productoNombre').value;
        const descripcion = document.getElementById('productoDescripcion').value;
        const activo = document.getElementById('productoActivo').checked;

        try {
            const response = await fetch('tables/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, nombre, descripcion, activo })
            });

            if (response.ok) {
                await loadAllData();
                renderProductos();
                hideModal();
                alert('Producto agregado exitosamente');
            }
        } catch (error) {
            console.error('Error adding producto:', error);
            alert('Error al agregar producto');
        }
    });
}

async function editProducto(productoId) {
    const prod = productos.find(p => p.id === productoId);
    if (!prod) return;

    showModal(`
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Editar Producto</h3>
            <form id="editProductoForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Código</label>
                    <input type="text" id="productoCodigo" required value="${prod.codigo}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                    <input type="text" id="productoNombre" required value="${prod.nombre}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                    <textarea id="productoDescripcion" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">${prod.descripcion}</textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="productoActivo" ${prod.activo ? 'checked' : ''} class="w-4 h-4 text-purple-600 mr-2">
                    <label class="text-sm font-semibold text-gray-700">Activo</label>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="hideModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    `);

    document.getElementById('editProductoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const codigo = document.getElementById('productoCodigo').value;
        const nombre = document.getElementById('productoNombre').value;
        const descripcion = document.getElementById('productoDescripcion').value;
        const activo = document.getElementById('productoActivo').checked;

        try {
            const response = await fetch(`tables/productos/${prod.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, nombre, descripcion, activo })
            });

            if (response.ok) {
                await loadAllData();
                renderProductos();
                hideModal();
                alert('Producto actualizado exitosamente');
            }
        } catch (error) {
            console.error('Error updating producto:', error);
            alert('Error al actualizar producto');
        }
    });
}

async function toggleProductoStatus(productoId) {
    const prod = productos.find(p => p.id === productoId);
    if (!prod) return;

    try {
        const response = await fetch(`tables/productos/${prod.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !prod.activo })
        });

        if (response.ok) {
            await loadAllData();
            renderProductos();
        }
    } catch (error) {
        console.error('Error toggling producto:', error);
    }
}

// ===== TASAS =====

function populateFilters() {
    const filterProducto = document.getElementById('filterProducto');
    filterProducto.innerHTML = '<option value="">Todos los productos</option>';
    productos.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nombre;
        filterProducto.appendChild(option);
    });

    const filterBanco = document.getElementById('filterBanco');
    filterBanco.innerHTML = '<option value="">Todos los bancos</option>';
    bancos.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = b.nombre;
        filterBanco.appendChild(option);
    });
}

function filterTasas() {
    const productoId = document.getElementById('filterProducto').value;
    const bancoId = document.getElementById('filterBanco').value;
    const tipoVivienda = document.getElementById('filterTipoVivienda').value;

    tasas = allTasas.filter(t => {
        if (productoId && t.producto_id !== productoId) return false;
        if (bancoId && t.banco_id !== bancoId) return false;
        if (tipoVivienda && t.tipo_vivienda !== tipoVivienda) return false;
        return true;
    });

    renderTasas();
}

function renderTasas() {
    const tbody = document.getElementById('tasasTableBody');
    tbody.innerHTML = '';

    tasas.forEach(tasa => {
        const banco = bancos.find(b => b.id === tasa.banco_id);
        const producto = productos.find(p => p.id === tasa.producto_id);

        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-3 py-2 text-xs">${banco ? banco.nombre : 'N/A'}</td>
            <td class="px-3 py-2 text-xs">${producto ? producto.nombre : 'N/A'}</td>
            <td class="px-3 py-2 text-center text-xs">
                <span class="px-2 py-1 rounded-full ${tasa.tipo_vivienda === 'VIS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">
                    ${tasa.tipo_vivienda}
                </span>
            </td>
            <td class="px-3 py-2 text-right text-xs">${tasa.tasa_ea_min.toFixed(2)}%</td>
            <td class="px-3 py-2 text-right text-xs">${tasa.tasa_ea_max.toFixed(2)}%</td>
            <td class="px-3 py-2 text-center text-xs">${tasa.vigencia}</td>
            <td class="px-3 py-2 text-center">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${tasa.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                    ${tasa.disponible ? 'Sí' : 'No'}
                </span>
            </td>
            <td class="px-3 py-2 text-center">
                <button onclick="editTasa('${tasa.id}')" class="text-blue-600 hover:text-blue-800 mx-1">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="toggleTasaStatus('${tasa.id}')" class="text-${tasa.disponible ? 'red' : 'green'}-600 hover:text-${tasa.disponible ? 'red' : 'green'}-800 mx-1">
                    <i class="fas fa-${tasa.disponible ? 'toggle-off' : 'toggle-on'}"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddTasaModal() {
    showModal(`
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Agregar Tasa</h3>
            <form id="addTasaForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Banco</label>
                        <select id="tasaBanco" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">Seleccionar</option>
                            ${bancos.map(b => `<option value="${b.id}">${b.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Producto</label>
                        <select id="tasaProducto" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">Seleccionar</option>
                            ${productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo Vivienda</label>
                        <select id="tasaTipo" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">Seleccionar</option>
                            <option value="VIS">VIS</option>
                            <option value="NO_VIS">NO VIS</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Vigencia (Ej: 2026-02)</label>
                        <input type="text" id="tasaVigencia" required value="2026-02" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tasa EA Mínima (%)</label>
                        <input type="number" id="tasaMin" required step="0.01" min="0" max="100" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tasa EA Máxima (%)</label>
                        <input type="number" id="tasaMax" required step="0.01" min="0" max="100" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="tasaDisponible" checked class="w-4 h-4 text-purple-600 mr-2">
                    <label class="text-sm font-semibold text-gray-700">Disponible</label>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="hideModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    `);

    document.getElementById('addTasaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const banco_id = document.getElementById('tasaBanco').value;
        const producto_id = document.getElementById('tasaProducto').value;
        const tipo_vivienda = document.getElementById('tasaTipo').value;
        const vigencia = document.getElementById('tasaVigencia').value;
        const tasa_ea_min = parseFloat(document.getElementById('tasaMin').value);
        const tasa_ea_max = parseFloat(document.getElementById('tasaMax').value);
        const disponible = document.getElementById('tasaDisponible').checked;

        try {
            const response = await fetch('tables/tasas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ banco_id, producto_id, tipo_vivienda, vigencia, tasa_ea_min, tasa_ea_max, disponible })
            });

            if (response.ok) {
                await loadAllData();
                filterTasas();
                hideModal();
                alert('Tasa agregada exitosamente');
            }
        } catch (error) {
            console.error('Error adding tasa:', error);
            alert('Error al agregar tasa');
        }
    });
}

async function editTasa(tasaId) {
    const tasa = allTasas.find(t => t.id === tasaId);
    if (!tasa) return;

    showModal(`
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Editar Tasa</h3>
            <form id="editTasaForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Banco</label>
                        <select id="tasaBanco" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            ${bancos.map(b => `<option value="${b.id}" ${b.id === tasa.banco_id ? 'selected' : ''}>${b.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Producto</label>
                        <select id="tasaProducto" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            ${productos.map(p => `<option value="${p.id}" ${p.id === tasa.producto_id ? 'selected' : ''}>${p.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo Vivienda</label>
                        <select id="tasaTipo" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="VIS" ${tasa.tipo_vivienda === 'VIS' ? 'selected' : ''}>VIS</option>
                            <option value="NO_VIS" ${tasa.tipo_vivienda === 'NO_VIS' ? 'selected' : ''}>NO VIS</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Vigencia</label>
                        <input type="text" id="tasaVigencia" required value="${tasa.vigencia}" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tasa EA Mínima (%)</label>
                        <input type="number" id="tasaMin" required step="0.01" min="0" max="100" value="${tasa.tasa_ea_min}" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Tasa EA Máxima (%)</label>
                        <input type="number" id="tasaMax" required step="0.01" min="0" max="100" value="${tasa.tasa_ea_max}" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="tasaDisponible" ${tasa.disponible ? 'checked' : ''} class="w-4 h-4 text-purple-600 mr-2">
                    <label class="text-sm font-semibold text-gray-700">Disponible</label>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="hideModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    `);

    document.getElementById('editTasaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const banco_id = document.getElementById('tasaBanco').value;
        const producto_id = document.getElementById('tasaProducto').value;
        const tipo_vivienda = document.getElementById('tasaTipo').value;
        const vigencia = document.getElementById('tasaVigencia').value;
        const tasa_ea_min = parseFloat(document.getElementById('tasaMin').value);
        const tasa_ea_max = parseFloat(document.getElementById('tasaMax').value);
        const disponible = document.getElementById('tasaDisponible').checked;

        try {
            const response = await fetch(`tables/tasas/${tasa.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ banco_id, producto_id, tipo_vivienda, vigencia, tasa_ea_min, tasa_ea_max, disponible })
            });

            if (response.ok) {
                await loadAllData();
                filterTasas();
                hideModal();
                alert('Tasa actualizada exitosamente');
            }
        } catch (error) {
            console.error('Error updating tasa:', error);
            alert('Error al actualizar tasa');
        }
    });
}

async function toggleTasaStatus(tasaId) {
    const tasa = allTasas.find(t => t.id === tasaId);
    if (!tasa) return;

    try {
        const response = await fetch(`tables/tasas/${tasa.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ disponible: !tasa.disponible })
        });

        if (response.ok) {
            await loadAllData();
            filterTasas();
        }
    } catch (error) {
        console.error('Error toggling tasa:', error);
    }
}

function showBulkUpdateModal() {
    showModal(`
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Actualización Masiva de Tasas</h3>
            <div class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-800 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Instrucciones
                    </h4>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>• Formato CSV: banco_id, producto_id, tipo_vivienda, tasa_min, tasa_max, vigencia</li>
                        <li>• Ejemplo: banco1,prod1,VIS,11.60,15.25,2026-03</li>
                        <li>• Una tasa por línea</li>
                    </ul>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Pegar Datos CSV</label>
                    <textarea id="bulkData" rows="10" placeholder="banco1,prod1,VIS,11.60,15.25,2026-03&#10;banco1,prod1,NO_VIS,11.60,15.25,2026-03" class="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"></textarea>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="hideModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button onclick="processBulkUpdate()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        <i class="fas fa-upload mr-2"></i>Procesar
                    </button>
                </div>
            </div>
        </div>
    `);
}

async function processBulkUpdate() {
    const data = document.getElementById('bulkData').value.trim();
    if (!data) {
        alert('Por favor ingrese datos para actualizar');
        return;
    }

    const lines = data.split('\n').filter(l => l.trim());
    const tasasToAdd = [];

    for (const line of lines) {
        const [banco_id, producto_id, tipo_vivienda, tasa_min, tasa_max, vigencia] = line.split(',').map(s => s.trim());
        
        if (!banco_id || !producto_id || !tipo_vivienda || !tasa_min || !tasa_max) {
            alert(`Línea inválida: ${line}`);
            return;
        }

        tasasToAdd.push({
            banco_id,
            producto_id,
            tipo_vivienda,
            tasa_ea_min: parseFloat(tasa_min),
            tasa_ea_max: parseFloat(tasa_max),
            vigencia: vigencia || '2026-02',
            disponible: true
        });
    }

    try {
        for (const tasa of tasasToAdd) {
            await fetch('tables/tasas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tasa)
            });
        }

        await loadAllData();
        filterTasas();
        hideModal();
        alert(`${tasasToAdd.length} tasas agregadas exitosamente`);
    } catch (error) {
        console.error('Error in bulk update:', error);
        alert('Error en la actualización masiva');
    }
}

// ===== MODAL UTILITIES =====

function showModal(content) {
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modalContainer').classList.remove('hidden');
}

function hideModal() {
    document.getElementById('modalContainer').classList.add('hidden');
}

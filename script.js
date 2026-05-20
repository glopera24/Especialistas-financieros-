// ==============================
// 🔹 CONEXIÓN SUPABASE (CDN v2 CORRECTA)
// ==============================

const supabaseUrl = "https://ctybuzownpuyqpexbbrj.supabase.co";
const supabaseKey = "sb_publishable_1XQhEKitO80NwoBjWxVLKA_BodBfHm_";

// Import correcto desde el namespace global del CDN
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);


// ==============================
// 🔹 SCROLL SUAVE
// ==============================

function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}


// ==============================
// 🔹 CUANDO CARGA EL DOM
// ==============================

document.addEventListener('DOMContentLoaded', () => {

// ==============================
// 🔹 SIMULADOR FINTECH AVANZADO
// ==============================

const formSimulador = document.getElementById('form-simulador');
const resultadoSimulador = document.getElementById('resultado-simulador');

if (formSimulador && resultadoSimulador) {

    formSimulador.addEventListener('submit', (e) => {
        e.preventDefault();

        const tipo = document.getElementById('tipo-credito').value;
        const valorBien = parseFloat(document.getElementById('valor-bien').value);
        const monto = parseFloat(document.getElementById('monto').value);
        const plazo = parseInt(document.getElementById('plazo').value);
        const ingreso = parseFloat(document.getElementById('ingreso').value);

        let plazoMax = 72;
        let porcentajeMax = 0.7;
        let tasa = 0.14 / 12;

        if (tipo === "hipotecario") {
            plazoMax = 240;
            porcentajeMax = 0.7;
            tasa = 0.115 / 12;
        }

        if (tipo === "leasing") {
            plazoMax = 240;
            porcentajeMax = 0.8;
            tasa = 0.125 / 12;
        }

        const maxCredito = valorBien * porcentajeMax;

        if (monto > maxCredito && tipo === "hipotecario") {

            resultadoSimulador.innerHTML = `
                <p class="error-message">
                Para financiación superior al 70% se recomienda leasing habitacional.
                </p>
            `;
            return;
        }

        if (plazo > plazoMax) {

            resultadoSimulador.innerHTML = `
                <p class="error-message">
                El plazo máximo permitido es ${plazoMax} meses.
                </p>
            `;
            return;
        }

        const cuota =
            (monto * tasa) /
            (1 - Math.pow(1 + tasa, -plazo));

        let seguro = 0;

        if (tipo === "vehiculo") {
            seguro = (monto / 1000000) * 900;
        }

        const cuotaTotal = cuota + seguro;

        const capacidad = ingreso * 0.35;

        let mensaje = "";

        if (cuotaTotal > capacidad) {
            mensaje = "⚠️ La cuota supera la capacidad recomendada.";
        } else {
            mensaje = "✅ Cliente dentro de capacidad de pago.";
        }

        resultadoSimulador.innerHTML = `
            <div class="resultado">
                <p><strong>Monto máximo financiable:</strong> ${maxCredito.toLocaleString('es-CO', {style:'currency',currency:'COP'})}</p>
                <p><strong>Seguro estimado:</strong> ${seguro.toLocaleString('es-CO', {style:'currency',currency:'COP'})}</p>
                <p><strong>Cuota mensual estimada:</strong> ${cuotaTotal.toLocaleString('es-CO', {style:'currency',currency:'COP'})}</p>
                <p><strong>Capacidad recomendada:</strong> ${capacidad.toLocaleString('es-CO', {style:'currency',currency:'COP'})}</p>
                <p><strong>${mensaje}</strong></p>
            </div>
        `;
    });
}

    // ==============================
    // 🔹 FORMULARIO CONTACTO
    // ==============================

    const formContacto = document.getElementById('form-contacto');
    const mensajeConfirmacionContacto = document.getElementById('mensaje-confirmacion');
    const mensajeErrorContacto = document.getElementById('mensaje-error-contacto');

    if (formContacto && mensajeConfirmacionContacto && mensajeErrorContacto) {

        mensajeConfirmacionContacto.style.display = 'none';
        mensajeErrorContacto.style.display = 'none';

        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();

            mensajeConfirmacionContacto.style.display = 'none';
            mensajeErrorContacto.style.display = 'none';

            try {
                const response = await fetch(formContacto.action, {
                    method: 'POST',
                    body: new FormData(formContacto),
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) throw new Error();

                mensajeConfirmacionContacto.style.display = 'block';
                formContacto.reset();

                setTimeout(() => {
                    mensajeConfirmacionContacto.style.display = 'none';
                }, 5000);

            } catch (error) {
                console.error('Error de contacto:', error);
                mensajeErrorContacto.style.display = 'block';

                setTimeout(() => {
                    mensajeErrorContacto.style.display = 'none';
                }, 5000);
            }
        });
    }


    // ==============================
    // 🔹 FORMULARIO REFERIDOS
    // ==============================

    const formReferidos = document.getElementById('form-referidos');
    const mensajeConfirmacionReferido = document.getElementById('mensaje-confirmacion-referido');
    const mensajeErrorReferido = document.getElementById('mensaje-error-referido');

    if (formReferidos && mensajeConfirmacionReferido && mensajeErrorReferido) {

        mensajeConfirmacionReferido.style.display = 'none';
        mensajeErrorReferido.style.display = 'none';

        formReferidos.addEventListener('submit', async (e) => {
            e.preventDefault();

            mensajeConfirmacionReferido.style.display = 'none';
            mensajeErrorReferido.style.display = 'none';

            try {
                const response = await fetch(formReferidos.action, {
                    method: 'POST',
                    body: new FormData(formReferidos),
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) throw new Error();

                mensajeConfirmacionReferido.style.display = 'block';
                formReferidos.reset();

                setTimeout(() => {
                    mensajeConfirmacionReferido.style.display = 'none';
                }, 5000);

            } catch (error) {
                console.error('Error de referidos:', error);
                mensajeErrorReferido.style.display = 'block';

                setTimeout(() => {
                    mensajeErrorReferido.style.display = 'none';
                }, 5000);
            }
        });
    }

    // 🔹 Cargar bancos al iniciar
    cargarBancos();

});


// ==============================
// 🔹 CARGAR BANCOS DESDE SUPABASE
// ==============================

async function cargarBancos() {

    try {
        const { data, error } = await supabaseClient
            .from("bancos")
            .select("*")
            .eq("activo", true)
            .order("orden", { ascending: true });

        if (error) throw error;

        console.log("Bancos desde Supabase:", data);

    } catch (error) {
        console.error("Error cargando bancos:", error);
    }
}

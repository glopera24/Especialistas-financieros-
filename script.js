// 🔹 Conexión Supabase
const supabaseUrl = "https://ctybuzownpuyqpexbbrj.supabase.co";
const supabaseKey = "sb_publishable_1XQhEKitO80NwoBjWxVLKA_BodBfHm_";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


// 🔹 Scroll suave a secciones
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}


document.addEventListener('DOMContentLoaded', () => {

    // ==============================
    // 🔹 SIMULADOR DE CRÉDITO
    // ==============================

    const formSimulador = document.getElementById('form-simulador');
    const resultadoSimulador = document.getElementById('resultado-simulador');

    if (formSimulador && resultadoSimulador) {
        formSimulador.addEventListener('submit', (e) => {
            e.preventDefault();

            const monto = parseFloat(document.getElementById('monto').value);
            const plazo = parseInt(document.getElementById('plazo').value, 10);
            const tasaAnual = parseFloat(document.getElementById('tasa').value);

            if (isNaN(monto) || isNaN(plazo) || isNaN(tasaAnual) || monto <= 0 || plazo <= 0) {
                resultadoSimulador.innerHTML = '<p class="error-message">Por favor ingresa valores válidos.</p>';
                return;
            }

            if (tasaAnual < 0 || tasaAnual > 1000) {
                resultadoSimulador.innerHTML = '<p class="error-message">La tasa anual parece irreal.</p>';
                return;
            }

            if (plazo > 360) {
                resultadoSimulador.innerHTML = '<p class="error-message">El plazo es demasiado largo.</p>';
                return;
            }

            const tasaMensual = tasaAnual / 12 / 100;
            let cuota;
            let total;

            if (tasaMensual === 0) {
                cuota = monto / plazo;
                total = monto;
            } else {
                cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
                total = cuota * plazo;
            }

            if (!isFinite(cuota) || !isFinite(total)) {
                resultadoSimulador.innerHTML = '<p class="error-message">Error en el cálculo.</p>';
                return;
            }

            resultadoSimulador.innerHTML = `
                <div class="resultado">
                    <p><strong>Cuota mensual:</strong> ${cuota.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                    <p><strong>Total a pagar:</strong> ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
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

});


// ==============================
// 🔹 CARGAR BANCOS DESDE SUPABASE
// ==============================

async function cargarBancos() {

    try {
        const { data, error } = await supabase
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

cargarBancos();

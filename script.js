// Scroll suave a secciones
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Simulador de crédito
    const formSimulador = document.getElementById('form-simulador');
    const resultadoSimulador = document.getElementById('resultado-simulador');

    if (formSimulador && resultadoSimulador) { // Aseguramos que los elementos existen
        formSimulador.addEventListener('submit', (e) => {
            e.preventDefault();

            const monto = parseFloat(document.getElementById('monto').value);
            const plazo = parseInt(document.getElementById('plazo').value, 10);
            const tasaAnual = parseFloat(document.getElementById('tasa').value);

            if (isNaN(monto) || isNaN(plazo) || isNaN(tasaAnual) || monto <= 0 || plazo <= 0) {
                resultadoSimulador.innerHTML = '<p class="error-message">Por favor ingresa valores válidos.</p>';
                return;
            }

            // Validación básica para evitar tasas o plazos excesivos que causen NaN o infinitos
            if (tasaAnual < 0 || tasaAnual > 1000) { // Tasa anual realista, ajusta si es necesario
                resultadoSimulador.innerHTML = '<p class="error-message">La tasa anual parece irreal. Intenta un valor más bajo.</p>';
                return;
            }
            if (plazo > 360) { // 30 años, un límite razonable
                resultadoSimulador.innerHTML = '<p class="error-message">El plazo es demasiado largo. Intenta un valor menor.</p>';
                return;
            }


            const tasaMensual = tasaAnual / 12 / 100; // Convertir a decimal mensual
            let cuota;
            let total;

            if (tasaMensual === 0) { // Si la tasa es 0, es un simple préstamo sin intereses
                cuota = monto / plazo;
                total = monto;
            } else {
                cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
                total = cuota * plazo;
            }

            // Manejo de valores no finitos (NaN, Infinity) que pueden ocurrir con entradas extremas
            if (isNaN(cuota) || !isFinite(cuota) || isNaN(total) || !isFinite(total)) {
                resultadoSimulador.innerHTML = '<p class="error-message">No fue posible calcular. Verifica tus entradas (tasa o plazo).</p>';
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

    // Formulario de contacto (Formspree)
    const formContacto = document.getElementById('form-contacto');
    const mensajeConfirmacionContacto = document.getElementById('mensaje-confirmacion');
    const mensajeErrorContacto = document.getElementById('mensaje-error-contacto');

    if (formContacto && mensajeConfirmacionContacto && mensajeErrorContacto) {
        mensajeConfirmacionContacto.style.display = 'none';
        mensajeErrorContacto.style.display = 'none'; // Ocultar mensaje de error inicialmente

        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            mensajeConfirmacionContacto.style.display = 'none'; // Ocultar mensajes anteriores
            mensajeErrorContacto.style.display = 'none';

            const formData = new FormData(formContacto);

            fetch(formContacto.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    mensajeConfirmacionContacto.style.display = 'block';
                    formContacto.reset();
                    // Opcional: Ocultar el mensaje después de unos segundos
                    setTimeout(() => {
                        mensajeConfirmacionContacto.style.display = 'none';
                    }, 5000);
                } else {
                    // Intenta leer el error de Formspree si está disponible
                    return response.json().then(data => {
                        throw new Error(data.error || 'Error desconocido al enviar formulario');
                    });
                }
            })
            .catch(error => {
                console.error('Error de contacto:', error);
                mensajeErrorContacto.style.display = 'block';
                // Opcional: Ocultar el mensaje después de unos segundos
                setTimeout(() => {
                    mensajeErrorContacto.style.display = 'none';
                }, 5000);
            });
        });
    }

    // Formulario de referidos (Formspree)
    const formReferidos = document.getElementById('form-referidos');
    const mensajeConfirmacionReferido = document.getElementById('mensaje-confirmacion-referido');
    const mensajeErrorReferido = document.getElementById('mensaje-error-referido'); // Asegúrate de que este ID existe en tu HTML

    if (formReferidos && mensajeConfirmacionReferido && mensajeErrorReferido) {
        mensajeConfirmacionReferido.style.display = 'none';
        mensajeErrorReferido.style.display = 'none'; // Ocultar mensaje de error inicialmente

        formReferidos.addEventListener('submit', (e) => {
            e.preventDefault();
            mensajeConfirmacionReferido.style.display = 'none'; // Ocultar mensajes anteriores
            mensajeErrorReferido.style.display = 'none';

            // Asegúrate de que TU_ENDPOINT_PARA_REFERIDOS se haya reemplazado en el HTML
            const formAction = formReferidos.action;
            if (formAction.includes('https://formspree.io/f/mwpoonwv')) {
                alert('¡Advertencia! El ID del formulario de referidos en el HTML no ha sido reemplazado. Por favor, actualiza el "action" del formulario con tu ID real de Formspree.');
                mensajeErrorReferido.innerText = 'Error: ID de formulario no configurado.';
                mensajeErrorReferido.style.display = 'block';
                return;
            }

            const formData = new FormData(formReferidos);

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    mensajeConfirmacionReferido.style.display = 'block';
                    formReferidos.reset();
                    // Opcional: Ocultar el mensaje después de unos segundos
                    setTimeout(() => {
                        mensajeConfirmacionReferido.style.display = 'none';
                    }, 5000);
                } else {
                     // Intenta leer el error de Formspree si está disponible
                    return response.json().then(data => {
                        throw new Error(data.error || 'Error desconocido al enviar formulario');
                    });
                }
            })
            .catch(error => {
                console.error('Error de referidos:', error);
                mensajeErrorReferido.style.display = 'block';
                // Opcional: Ocultar el mensaje después de unos segundos
                setTimeout(() => {
                    mensajeErrorReferido.style.display = 'none';
                }, 5000);
            });
        });
    }

    // Animación carrusel (si aplica) - Tu código CSS ya maneja la animación de manera fluida.
    // Esto es solo si necesitas interactuar con el carrusel mediante JS.
    // const track = document.querySelector('.carousel-track');
    // if (track) {
    //   track.addEventListener('animationiteration', () => {
    //     // El carrusel se reinicia automáticamente por CSS.
    //     // Si necesitas una lógica JS más compleja, iría aquí.
    //   });
    // }
});

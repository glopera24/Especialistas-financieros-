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
                resultadoSimulador.innerHTML = '<p class="error-message">La tasa anual parece irreal. Intenta un valor más bajo.</p>';
                return;
            }
            if (plazo > 360) {
                resultadoSimulador.innerHTML = '<p class="error-message">El plazo es demasiado largo. Intenta un valor menor.</p>';
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
        mensajeErrorContacto.style.display = 'none';

        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            mensajeConfirmacionContacto.style.display = 'none';
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
                    setTimeout(() => {
                        mensajeConfirmacionContacto.style.display = 'none';
                    }, 5000);
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Error desconocido al enviar formulario');
                    });
                }
            })
            .catch(error => {
                console.error('Error de contacto:', error);
                mensajeErrorContacto.style.display = 'block';
                setTimeout(() => {
                    mensajeErrorContacto.style.display = 'none';
                }, 5000);
            });
        });
    }

    // Formulario de referidos (Formspree)
    const formReferidos = document.getElementById('form-referidos');
    const mensajeConfirmacionReferido = document.getElementById('mensaje-confirmacion-referido');
    const mensajeErrorReferido = document.getElementById('mensaje-error-referido');

    if (formReferidos && mensajeConfirmacionReferido && mensajeErrorReferido) {
        mensajeConfirmacionReferido.style.display = 'none';
        mensajeErrorReferido.style.display = 'none';

        formReferidos.addEventListener('submit', (e) => {
            e.preventDefault();
            mensajeConfirmacionReferido.style.display = 'none';
            mensajeErrorReferido.style.display = 'none';

            // *** ELIMINA O COMENTA ESTAS LÍNEAS DE CÓDIGO ***
            // const formAction = formReferidos.action;
            // if (formAction.includes('https://formspree.io/f/mwpoonwv')) {
            //     alert('¡Advertencia! El ID del formulario de referidos en el HTML no ha sido reemplazado. Por favor, actualiza el "action" del formulario con tu ID real de Formspree.');
            //     mensajeErrorReferido.innerText = 'Error: ID de formulario no configurado.';
            //     mensajeErrorReferido.style.display = 'block';
            //     return;
            // }
            // *** FIN DE LAS LÍNEAS A ELIMINAR/COMENTAR ***

            const formData = new FormData(formReferidos);

            fetch(formReferidos.action, { // Ahora usa directamente formReferidos.action
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    mensajeConfirmacionReferido.style.display = 'block';
                    formReferidos.reset();
                    setTimeout(() => {
                        mensajeConfirmacionReferido.style.display = 'none';
                    }, 5000);
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Error desconocido al enviar formulario');
                    });
                }
            })
            .catch(error => {
                console.error('Error de referidos:', error);
                mensajeErrorReferido.style.display = 'block';
                setTimeout(() => {
                    mensajeErrorReferido.style.display = 'none';
                }, 5000);
            });
        });
    }

    // Animación carrusel (si aplica)
    // El código CSS ya maneja la animación.
});

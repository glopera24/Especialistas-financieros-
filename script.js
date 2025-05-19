document.addEventListener('DOMContentLoaded', () => {
  // Simulador de crédito
  const formSimulador = document.getElementById('form-simulador');
  const resultadoSimulador = document.getElementById('resultado-simulador');

  if (formSimulador) {
    formSimulador.addEventListener('submit', (e) => {
      e.preventDefault();

      const monto = parseFloat(document.getElementById('monto').value);
      const plazo = parseInt(document.getElementById('plazo').value);
      const tasa = parseFloat(document.getElementById('tasa').value) / 100 / 12;

      if (isNaN(monto) || isNaN(plazo) || isNaN(tasa)) {
        resultadoSimulador.innerHTML = '<p style="color:red">Todos los campos son obligatorios y deben ser válidos.</p>';
        return;
      }

      const cuota = (monto * tasa) / (1 - Math.pow(1 + tasa, -plazo));
      const total = cuota * plazo;

      resultadoSimulador.innerHTML = `
        <div class="resultado">
          <p><strong>Cuota mensual:</strong> $${cuota.toLocaleString()}</p>
          <p><strong>Total a pagar:</strong> $${total.toLocaleString()}</p>
        </div>
      `;
    });
  }

  // Función general para enviar formulario con fetch evitando redirección
  function manejarEnvioForm(form, mensajeOk, mensajeError) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      mensajeOk.style.display = 'none';
      mensajeError.style.display = 'none';

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          mensajeOk.style.display = 'block';
          form.reset();
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Error en el envío');
          });
        }
      })
      .catch(() => {
        mensajeError.style.display = 'block';
      });
    });
  }

  // Formulario contacto
  const formContacto = document.getElementById('form-contacto');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

  if (formContacto && mensajeConfirmacion) {
    // Crear un mensaje de error para contacto
    let mensajeErrorContacto = document.createElement('p');
    mensajeErrorContacto.style.display = 'none';
    mensajeErrorContacto.style.color = 'red';
    mensajeErrorContacto.textContent = 'Error al enviar el formulario, intenta de nuevo.';
    formContacto.appendChild(mensajeErrorContacto);

    manejarEnvioForm(formContacto, mensajeConfirmacion, mensajeErrorContacto);
  }

  // Formulario referidos
  const formReferidos = document.getElementById('form-referidos');
  const mensajeConfirmacionReferido = document.getElementById('mensaje-confirmacion-referido');
  const mensajeErrorReferido = document.getElementById('mensaje-error-referido');

  if (formReferidos && mensajeConfirmacionReferido && mensajeErrorReferido) {
    manejarEnvioForm(formReferidos, mensajeConfirmacionReferido, mensajeErrorReferido);
  }
});

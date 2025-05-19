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

  // Formulario referidos (sin envío real, solo simulación)
  const formReferidos = document.getElementById('form-referidos');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion-referido');

  if (formReferidos) {
    formReferidos.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validar campos obligatorios del formulario referidos
      const nombreReferente = formReferidos.referente_nombre.value.trim();
      const emailReferente = formReferidos.referente_email.value.trim();
      const telefonoReferente = formReferidos.referente_telefono.value.trim();
      const nombreReferido = formReferidos.referido_nombre.value.trim();
      const productoInteres = formReferidos.producto_interes.value;

      if (!nombreReferente || !emailReferente || !telefonoReferente || !nombreReferido || !productoInteres) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
      }

      // Simular envío y mostrar mensaje
      mensajeConfirmacion.style.display = 'none';
      setTimeout(() => {
        mensajeConfirmacion.style.display = 'block';
        formReferidos.reset();
      }, 500);
    });
  }
});

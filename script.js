document.addEventListener('DOMContentLoaded', () => {
  // Simulador de crédito
  const formSimulador = document.getElementById('form-simulador');
  const resultadoSimulador = document.getElementById('resultado-simulador');

  if (formSimulador) {
    formSimulador.addEventListener('submit', (e) => {
      e.preventDefault();

      // Obtener los valores del formulario
      const monto = parseFloat(document.getElementById('monto').value);
      const plazo = parseInt(document.getElementById('plazo').value);
      const tasa = parseFloat(document.getElementById('tasa').value) / 100 / 12;

      // Validación de los campos
      if (isNaN(monto) || isNaN(plazo) || isNaN(tasa)) {
        resultadoSimulador.innerHTML = '<p style="color:red">Todos los campos son obligatorios y deben ser válidos.</p>';
        return;
      }

      // Cálculo de la cuota mensual y total a pagar
      const cuota = (monto * tasa) / (1 - Math.pow(1 + tasa, -plazo));
      const total = cuota * plazo;

      // Mostrar los resultados formateados
      resultadoSimulador.innerHTML = `
        <div class="resultado">
          <p><strong>Cuota mensual:</strong> $${cuota.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <p><strong>Total a pagar:</strong> $${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
      `;
    });
  }

  // Formulario de contacto usando Formspree, evitando salir de la página
  const formContacto = document.getElementById('form-contacto');
  const mensajeConfirmacionContacto = document.getElementById('mensaje-confirmacion');

  if (formContacto) {
    mensajeConfirmacionContacto.style.display = 'none'; // Oculto al inicio
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();

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
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Error al enviar formulario');
          });
        }
      })
      .catch(error => {
        alert('Error al enviar el formulario de contacto. Por favor intenta más tarde.');
        console.error(error);
      });
    });
  }

  // Formulario de referidos usando fetch para enviar sin salir
  const formReferidos = document.getElementById('form-referidos');
  const mensajeConfirmacionReferido = document.getElementById('mensaje-confirmacion-referido');

  if (formReferidos) {
    mensajeConfirmacionReferido.style.display = 'none'; // Oculto al inicio
    formReferidos.addEventListener('submit', (e) => {
      e.preventDefault();

      // Preparar los datos para enviar, aquí debes cambiar la URL y método según tu backend
      const formData = new FormData(formReferidos);

      fetch('TU_ENDPOINT_PARA_REFERIDOS', {  // Cambia por tu URL real
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (response.ok) {
          mensajeConfirmacionReferido.style.display = 'block';
          formReferidos.reset();
        } else {
          throw new Error('Error al enviar formulario de referidos');
        }
      })
      .catch(error => {
        alert('Error al enviar el formulario de referidos. Intenta más tarde.');
        console.error(error);
      });
    });
  }
});

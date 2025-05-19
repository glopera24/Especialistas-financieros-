document.addEventListener('DOMContentLoaded', () => {
  // Simulador de crédito
  const formSimulador = document.getElementById('form-simulador');
  const resultadoSimulador = document.getElementById('resultado-simulador');

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
        <p><strong>Cuota mensual:</strong> $${cuota.toLocaleString()}</p>
        <p><strong>Total a pagar:</strong> $${total.toLocaleString()}</p>
      </div>
    `;
  });

document.addEventListener('DOMContentLoaded', () => {
  const formReferidos = document.getElementById('form-referidos');
  const mensajeConfirmacionReferido = document.getElementById('mensaje-confirmacion-referido');

  const scriptURL = "https://script.google.com/macros/s/AKfycbzq5nlyMaxwWnHE6-kmLaqsDYYBd_oO5AXLyu2BiexhjrYUNzdHtGmFIsDAFmlaJ38S/exec";

  if (formReferidos) {
    formReferidos.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(formReferidos);

      fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
      .then(() => {
        if (mensajeConfirmacionReferido) {
          mensajeConfirmacionReferido.style.display = 'block';
        }
        formReferidos.reset();
      })
      .catch((error) => {
        alert('Hubo un error al enviar el formulario de referidos. Intenta de nuevo.');
        console.error('Error al enviar formulario referidos:', error);
      });
    });
  }
});
  }

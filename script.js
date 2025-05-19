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
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion-referido');
  const mensajeError = document.getElementById('mensaje-error-referido');

  if (formReferidos) {
    formReferidos.addEventListener('submit', (e) => {
      e.preventDefault();

      mensajeConfirmacion.style.display = 'none';
      mensajeError.style.display = 'none';

      const formData = new FormData(formReferidos);

      fetch('https://script.google.com/macros/s/TU_SCRIPT_ID/exec', { // Cambia TU_SCRIPT_ID por el correcto
        method: 'POST',
        body: formData,
        mode: 'cors' // 'no-cors' limita respuestas, mejor cors si configuras correctamente el Apps Script
      })
      .then(response => response.json())
      .then(data => {
        if(data.result === 'success') {
          mensajeConfirmacion.style.display = 'block';
          formReferidos.reset();
        } else {
          mensajeError.style.display = 'block';
          console.error('Error en respuesta:', data.error);
        }
      })
      .catch(error => {
        mensajeError.style.display = 'block';
        console.error('Error al enviar formulario:', error);
      });
    });
  }
});

}

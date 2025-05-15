document.addEventListener('DOMContentLoaded', () => {
  // Simulador de crédito
  const formSimulador = document.getElementById('form-simulador');
  const resultadoSimulador = document.getElementById('resultado-simulador');

  formSimulador.addEventListener('submit', (e) => {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasa = parseFloat(document.getElementById('tasa').value) / 100 / 12;

    if (!monto || !plazo || !tasa) {
      resultadoSimulador.innerHTML = '<p style="color:red">Todos los campos son obligatorios.</p>';
      return;
    }

    const cuota = (monto * tasa) / (1 - Math.pow(1 + tasa, -plazo));
    const total = cuota * plazo;

    resultadoSimulador.innerHTML = `
      <div class="resultado">
        <p><strong>Cuota mensual:</strong> $${cuota.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
        <p><strong>Total a pagar:</strong> $${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
      </div>
    `;
  });

  // Formulario de contacto
  const formContacto = document.getElementById('form-contacto');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

  if (formContacto) {
    formContacto.addEventListener('submit', () => {
      setTimeout(() => {
        mensajeConfirmacion.style.display = 'block';
        formContacto.reset();
      }, 1000);
    });
  }
});

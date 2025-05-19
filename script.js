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

  // Formulario de contacto
  const formContacto = document.getElementById('form-contacto');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

  if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar el envío inmediato para validaciones
      // Verificar que todos los campos estén llenos antes de mostrar confirmación
      const nombre = formContacto.nombre.value;
      const telefono = formContacto.telefono.value;
      const email = formContacto.email.value;
      const mensaje = formContacto.mensaje.value;

      if (!nombre || !telefono || !email || !mensaje) {
        alert('Todos los campos son obligatorios');
        return;
      }

      // Simular el envío y mostrar confirmación después de 1 segundo
      setTimeout(() => {
        mensajeConfirmacion.style.display = 'block';
        formContacto.reset();
      }, 1000);
    });
  }

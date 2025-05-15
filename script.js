// Scroll suave hacia secciones
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 80, // Ajuste para el header
      behavior: 'smooth'
    });
  }
}

// Simulador de crédito
document.getElementById('form-simulador').addEventListener('submit', function (e) {
  e.preventDefault();

  const monto = parseFloat(document.getElementById('monto').value);
  const plazo = parseInt(document.getElementById('plazo').value);
  const tasa = parseFloat(document.getElementById('tasa').value);

  if (isNaN(monto) || isNaN(plazo) || isNaN(tasa) || monto <= 0 || plazo <= 0 || tasa <= 0) {
    document.getElementById('resultado-simulador').textContent = 'Por favor ingresa valores válidos.';
    return;
  }

  const tasaMensual = tasa / 100 / 12;
  const cuota = monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo));
  const cuotaFormateada = cuota.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  document.getElementById('resultado-simulador').textContent =
    `Tu cuota mensual aproximada sería: ${cuotaFormateada}`;
});

// Formulario de contacto - mensaje de confirmación
document.getElementById('form-contacto').addEventListener('submit', function (e) {
  const confirmacion = document.getElementById('mensaje-confirmacion');
  confirmacion.style.display = 'block';
  setTimeout(() => {
    confirmacion.style.display = 'none';
  }, 6000);
});

// Simulador
document
  .getElementById('form-simulador')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasaAnual = parseFloat(document.getElementById('tasa').value);

    const tasaMensual = tasaAnual / 12 / 100;
    const cuota =
      (monto * tasaMensual) /
      (1 - Math.pow(1 + tasaMensual, -plazo));

    document.getElementById(
      'resultado-simulador'
    ).innerHTML = `<h3>Cuota mensual estimada: ${cuota.toLocaleString(
      'es-CO',
      { style: 'currency', currency: 'COP' }
    )}</h3>`;
  });

// Contacto
document
  .getElementById('form-contacto')
  .addEventListener('submit', function () {
    document.getElementById('mensaje-confirmacion').style.display =
      'block';
  });

// Scroll suave
function scrollToSection(id) {
  document
    .getElementById(id)
    .scrollIntoView({ behavior: 'smooth' });
}

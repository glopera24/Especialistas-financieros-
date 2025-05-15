
document.getElementById('formSimulador').addEventListener('submit', function(e) {
  e.preventDefault();
  const monto = parseFloat(document.getElementById('monto').value);
  const plazo = parseFloat(document.getElementById('plazo').value);
  const tasa = parseFloat(document.getElementById('tasa').value) / 100 / 12;
  const cuota = monto * tasa / (1 - Math.pow(1 + tasa, -plazo));
  document.getElementById('resultado-simulador').textContent =
    "Cuota mensual aproximada: $" + cuota.toFixed(2);
});

document.getElementById('formContacto').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('mensaje-confirmacion').style.display = 'block';
});

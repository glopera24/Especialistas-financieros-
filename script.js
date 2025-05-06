
function calcular() {
  const monto = parseFloat(document.getElementById('monto').value);
  const plazo = parseInt(document.getElementById('plazo').value);
  const interesAnual = parseFloat(document.getElementById('interes').value) / 100;
  const interesMensual = interesAnual / 12;
  const cuota = (monto * interesMensual) / (1 - Math.pow(1 + interesMensual, -plazo));
  document.getElementById('resultado').innerText = 'Cuota mensual: $' + cuota.toFixed(2);
}

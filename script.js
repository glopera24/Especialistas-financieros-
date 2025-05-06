
function calcularCuota() {
  var monto = parseFloat(document.getElementById('monto').value);
  var tiempo = parseFloat(document.getElementById('tiempo').value);
  var interes = parseFloat(document.getElementById('interes').value) / 100 / 12;

  var cuota = (monto * interes) / (1 - Math.pow(1 + interes, -tiempo));
  document.getElementById('resultado').innerText = "Cuota mensual: $" + cuota.toFixed(2);
}

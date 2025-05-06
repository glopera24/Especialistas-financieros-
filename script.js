function calcularCuota() {
  const monto = parseFloat(document.getElementById("monto").value);
  const plazo = parseInt(document.getElementById("plazo").value);
  const interesAnual = parseFloat(document.getElementById("interes").value) / 100;

  if (!monto || !plazo || !interesAnual) return;

  const interesMensual = interesAnual / 12;
  const cuota = (monto * interesMensual) / (1 - Math.pow(1 + interesMensual, -plazo));
  document.getElementById("resultado").innerText = `Cuota Mensual: $${cuota.toFixed(2)}`;
}

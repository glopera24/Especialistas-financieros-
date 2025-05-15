// Scroll suave a secciones (desde navegación)
function scrollToSection(id) {
  const elem = document.getElementById(id);
  if (elem) {
    elem.scrollIntoView({ behavior: "smooth" });
  }
}

// Simulador de crédito
document.getElementById("form-simulador").addEventListener("submit", function (e) {
  e.preventDefault();

  const monto = parseFloat(document.getElementById("monto").value);
  const plazo = parseInt(document.getElementById("plazo").value, 10);
  const tasaAnual = parseFloat(document.getElementById("tasa").value);

  // Validar entradas
  if (isNaN(monto) || isNaN(plazo) || isNaN(tasaAnual) || monto <= 0 || plazo <= 0) {
    document.getElementById("resultado-simulador").textContent =
      "Por favor ingresa valores válidos.";
    return;
  }

  const tasaMensual = tasaAnual / 12 / 100;
  const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
  const cuotaRedondeada = cuota.toFixed(2);

  document.getElementById("resultado-simulador").textContent =
    `Tu cuota mensual aproximada es: $${cuotaRedondeada} COP`;
});

// Envío formulario contacto con confirmación simple
const formContacto = document.getElementById("form-contacto");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

formContacto.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formContacto);
  fetch(formContacto.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        mensajeConfirmacion.style.display = "block";
        formContacto.reset();
        setTimeout(() => {
          mensajeConfirmacion.style.display = "none";
        }, 8000);
      } else {
        alert("Hubo un problema enviando el mensaje, inténtalo de nuevo.");
      }
    })
    .catch(() => {
      alert("Hubo un problema enviando el mensaje, inténtalo de nuevo.");
    });
});

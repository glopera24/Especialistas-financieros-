// Simulador de crédito
document.addEventListener("DOMContentLoaded", () => {
  const simuladorForm = document.getElementById("form-simulador");
  const resultadoDiv = document.getElementById("resultado-simulador");

  if (simuladorForm) {
    simuladorForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const monto = parseFloat(document.getElementById("monto").value);
      const interes = parseFloat(document.getElementById("interes").value);
      const plazo = parseInt(document.getElementById("plazo").value);

      if (isNaN(monto) || isNaN(interes) || isNaN(plazo)) {
        resultadoDiv.textContent = "Por favor ingresa valores válidos.";
        resultadoDiv.style.color = "red";
        return;
      }

      const tasaMensual = interes / 100 / 12;
      const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
      resultadoDiv.textContent = `Cuota mensual aproximada: $${cuota.toFixed(2)}`;
      resultadoDiv.style.color = "#007a33";
    });
  }

  // Formulario de contacto
  const formContacto = document.getElementById("form-contacto");
  const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

  if (formContacto) {
    formContacto.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const correo = document.getElementById("correo").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (!nombre || !correo || !telefono || !mensaje) {
        alert("Por favor completa todos los campos.");
        return;
      }

      mensajeConfirmacion.style.display = "block";
      mensajeConfirmacion.textContent = "Gracias por contactarnos. Te responderemos pronto.";

      formContacto.reset();
    });
  }

  // Animaciones de scroll (opcional para mejorar UX)
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  const elementosAnimados = document.querySelectorAll(".section, .card, .perfil, .simulador, .contacto");
  elementosAnimados.forEach(el => {
    el.classList.add("oculto"); // Ocultos inicialmente con CSS
    observer.observe(el);
  });
});

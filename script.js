// Scroll suave a secciones
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Simulador de crédito
  const formSimulador = document.getElementById('form-simulador');
  const resultadoSimulador = document.getElementById('resultado-simulador');

  if (formSimulador) {
    formSimulador.addEventListener('submit', (e) => {
      e.preventDefault();

      const monto = parseFloat(document.getElementById('monto').value);
      const plazo = parseInt(document.getElementById('plazo').value, 10);
      const tasaAnual = parseFloat(document.getElementById('tasa').value);

      if (isNaN(monto) || isNaN(plazo) || isNaN(tasaAnual) || monto <= 0 || plazo <= 0) {
        resultadoSimulador.innerHTML = '<p style="color:red">Por favor ingresa valores válidos.</p>';
        return;
      }

      const tasaMensual = tasaAnual / 12 / 100;
      const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
      const total = cuota * plazo;

      resultadoSimulador.innerHTML = `
        <div class="resultado">
          <p><strong>Cuota mensual:</strong> ${cuota.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
          <p><strong>Total a pagar:</strong> ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
        </div>
      `;
    });
  }

  // Formulario de contacto (Formspree)
  const formContacto = document.getElementById('form-contacto');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

  if (formContacto) {
    mensajeConfirmacion.style.display = 'none';

    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(formContacto);

      fetch(formContacto.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            mensajeConfirmacion.style.display = 'block';
            formContacto.reset();
          } else {
            throw new Error('Error al enviar formulario');
          }
        })
        .catch(error => {
          alert('Error al enviar el formulario de contacto. Intenta de nuevo.');
          console.error(error);
        });
    });
  }

  // Formulario de referidos (actualizar endpoint)
  const formReferidos = document.getElementById('form-referidos');
  const mensajeReferido = document.getElementById('mensaje-confirmacion-referido');

  if (formReferidos) {
    mensajeReferido.style.display = 'none';

    formReferidos.addEventListener('submit', (e) => {
      e.preventDefault();

      fetch('TU_ENDPOINT_PARA_REFERIDOS', {
        method: 'POST',
        body: new FormData(formReferidos)
      })
        .then(res => {
          if (res.ok) {
            mensajeReferido.style.display = 'block';
            formReferidos.reset();
          } else {
            throw new Error('Error en el envío');
          }
        })
        .catch(err => {
          alert('No fue posible enviar el formulario de referidos.');
          console.error(err);
        });
    });
  }

  // Animación carrusel (si aplica)
  const track = document.querySelector('.carousel-track');
  if (track) {
    track.addEventListener('animationiteration', () => {
      // Ya se reinicia por CSS
    });
  }
});

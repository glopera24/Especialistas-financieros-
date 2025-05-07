// scroll suave a secciones (si llamas scrollToSection desde botones)
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Simulador de crédito
document.getElementById('form-simulador').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const monto    = parseFloat(document.getElementById('monto').value);
  const plazo    = parseInt  (document.getElementById('plazo').value, 10);
  const tasaAnual= parseFloat(document.getElementById('tasa').value);

  // validar entradas
  if (isNaN(monto) || isNaN(plazo) || isNaN(tasaAnual) || monto <= 0 || plazo <= 0) {
    document.getElementById('resultado-simulador').textContent = 'Por favor ingresa valores válidos.';
    return;
  }

  const tasaMensual = tasaAnual / 12 / 100;
  const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
  
  document.getElementById('resultado-simulador').innerHTML =
    `<h3>Cuota mensual estimada: ${cuota.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP'
    })}</h3>`;
});

// Animar carrusel infinito (reinicia posición al llegar al final)
const track = document.querySelector('.carousel-track');
track.addEventListener('animationiteration', () => {
  // nada adicional, la keyframe ya lo repite
});

// Formulario de contacto con confirmación
document.getElementById('form-contacto').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const form     = e.target;
  const mensaje  = document.getElementById('mensaje-confirmacion');

  fetch(form.action, {
    method:  form.method,
    body:    new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      form.reset();
      mensaje.style.display = 'block';
    } else {
      alert('Hubo un error enviando el mensaje. Intenta de nuevo.');
    }
  })
  .catch(() => alert('Error de red al enviar el formulario.'));
});

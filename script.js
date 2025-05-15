document.addEventListener('DOMContentLoaded', function() {
  // Animación al scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .section').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });

  // Simulador de crédito
  document.getElementById('form-simulador').addEventListener('submit', function(e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value, 10);
    const tasaAnual = parseFloat(document.getElementById('tasa').value);

    if (isNaN(monto) || isNaN(plazo) || isNaN(tasaAnual) || monto <= 0 || plazo <= 0) {
      document.getElementById('resultado-simulador').textContent = 'Por favor ingresa valores válidos.';
      return;
    }

    const tasaMensual = tasaAnual / 12 / 100;
    const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
    
    document.getElementById('resultado-simulador').innerHTML = `
      <h3>Cuota mensual estimada: ${cuota.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
      })}</h3>
    `;
  });

  // Formulario de contacto
  document.getElementById('form-contacto').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const mensaje = document.getElementById('mensaje-confirmacion');

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        form.reset();
        mensaje.style.display = 'block';
        setTimeout(() => mensaje.style.display = 'none', 3000);
      }
    })
    .catch(() => alert('Error de red al enviar el formulario.'));
  });
});

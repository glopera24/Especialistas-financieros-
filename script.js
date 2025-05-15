document.addEventListener('DOMContentLoaded', function() {
  // Animaciones al scroll
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
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });

  // Simulador de crédito
  const formSimulador = document.getElementById('form-simulador');
  if(formSimulador) {
    formSimulador.addEventListener('submit', function(e) {
      e.preventDefault();
      const monto = parseFloat(document.getElementById('monto').value);
      const plazo = parseInt(document.getElementById('plazo').value);
      const tasa = parseFloat(document.getElementById('tasa').value);

      if (!monto || !plazo || !tasa) {
        alert('Por favor completa todos los campos');
        return;
      }

      const tasaMensual = tasa / 12 / 100;
      const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
      
      document.getElementById('resultado-simulador').innerHTML = `
        <h3>Cuota mensual estimada: ${cuota.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP'
        })}</h3>
      `;
    });
  }

  // Formulario de contacto
  const formContacto = document.getElementById('form-contacto');
  if(formContacto) {
    formContacto.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      
      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if(response.ok) {
          this.reset();
          alert('Mensaje enviado con éxito');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  }
});

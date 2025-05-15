document.addEventListener('DOMContentLoaded', function() {
  // Animaciones al scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card-servicio, .equipo-content, .simulador-container');
    elements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Ejecutar al cargar

  // Simulador de Crédito
  const formSimulador = document.getElementById('form-simulador');
  if (formSimulador) {
    formSimulador.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const monto = parseFloat(document.getElementById('monto').value);
      const plazo = parseInt(document.getElementById('plazo').value);
      const tasa = parseFloat(document.getElementById('tasa').value);
      
      const tasaMensual = tasa / 12 / 100;
      const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
      
      document.getElementById('resultado-simulador').innerHTML = `
        <div class="resultado">
          <h3>Cuota estimada:</h3>
          <p>${cuota.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}</p>
        </div>
      `;
    });
  }

  // Formulario de Contacto
  const formContacto = document.getElementById('form-contacto');
  if (formContacto) {
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
        if (response.ok) {
          alert('Mensaje enviado con éxito');
          this.reset();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  }
});

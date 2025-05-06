// Simulador
document.getElementById('form-simulador').addEventListener('submit', e => {
  e.preventDefault();
  const M = +document.getElementById('monto').value;
  const N = +document.getElementById('plazo').value;
  const r = +document.getElementById('tasa').value/100/12;
  const cuota = (M*r) / (1 - (1+r)**(-N));
  document.getElementById('resultado-simulador').innerText =
    `Cuota Mensual: $${cuota.toFixed(2)}`;
});

// Contact Form
document.getElementById('form-contacto').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const res  = await fetch(form.action, {
    method:'POST', body:new FormData(form), headers:{Accept:'application/json'}
  });
  if(res.ok) {
    form.reset();
    document.getElementById('mensaje-confirmacion').style.display = 'block';
  }
});

// Scroll helper
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior:'smooth' });
}

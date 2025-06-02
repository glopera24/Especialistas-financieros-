
document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('toggleTheme');
  themeToggle?.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });

  // Formulario contacto
  const formContacto = document.getElementById('form-contacto');
  formContacto?.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(formContacto);
    fetch(formContacto.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    }).then((res) => {
      if (res.ok) {
        document.getElementById('mensaje-confirmacion').style.display = 'block';
        formContacto.reset();
      }
    });
  });

  // Formulario referidos
  const formReferidos = document.getElementById('form-referidos');
  formReferidos?.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(formReferidos);
    fetch(formReferidos.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    }).then((res) => {
      if (res.ok) {
        document.getElementById('mensaje-confirmacion-referido').style.display = 'block';
        formReferidos.reset();
      }
    });
  });

  // Scroll reveal
  const observers = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  observers.forEach(el => observer.observe(el));
});

document.getElementById('form-contacto').addEventListener('submit', function(event) {
  event.preventDefault();
  const form = event.target;
  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      form.reset();
      document.getElementById('mensaje-confirmacion').style.display = 'block';
    }
  });
});

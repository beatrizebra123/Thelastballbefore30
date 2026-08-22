(function(){

  /* ---------- Pop-ups ---------- */
  var overlay = document.getElementById('overlay');
  var buttons = document.querySelectorAll('.sidebar button');
  var closeButtons = document.querySelectorAll('.modal-close');
  var modals = document.querySelectorAll('.modal');

  function openModal(id){
    modals.forEach(function(m){ m.hidden = (m.id !== 'modal-' + id); });
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    overlay.classList.remove('open');
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      openModal(btn.getAttribute('data-modal'));
    });
  });

  closeButtons.forEach(function(btn){
    btn.addEventListener('click', closeModal);
  });

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });

  /* ---------- RSVP demo (sin backend) ---------- */
  var form = document.getElementById('rsvpForm');
  var confirmMsg = document.getElementById('rsvpConfirm');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var nombre = form.nombre.value.trim();
    var acompanantes = form.acompanantes.value;
    var notas = form.notas.value.trim();

    confirmMsg.textContent = (nombre ? nombre + ', tu' : 'Tu') + ' nombre queda inscrito en la lista. Nos vemos el 28 de noviembre.';
    confirmMsg.classList.add('show');
    form.style.display = 'none';

    var subject = encodeURIComponent('Confirmación — The Last Ball Before Judgement');
    var body = encodeURIComponent('Nombre: ' + nombre + '\nAcompañantes: ' + acompanantes + '\nNotas: ' + notas);
    var mailto = 'mailto:rsvp@thelastball.com?subject=' + subject + '&body=' + body;

    window.setTimeout(function(){
      window.location.href = mailto;
    }, 500);
  });
})();

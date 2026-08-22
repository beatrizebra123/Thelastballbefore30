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

  /* ---------- Imágenes del Dress Code (prueba varias extensiones) ---------- */
  var exts = ['jpg', 'jpeg', 'png', 'webp'];

  document.querySelectorAll('.dc-item img[data-base]').forEach(function(img){
    var base = img.getAttribute('data-base');
    var i = 0;

    function tryNext(){
      if(i >= exts.length){
        img.classList.add('dc-error');
        return;
      }
      img.src = base + '.' + exts[i++];
    }

    img.addEventListener('error', tryNext);
    img.addEventListener('load', function(){
      this.classList.add('dc-loaded');
    });
    tryNext();
  });

})();

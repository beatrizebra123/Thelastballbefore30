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

  /* ---------- Aviso al confirmar (opcional, ver js/notify.js) ---------- */
  function notifyRSVP(listName, guestName, actionText){
    var cfg = window.NOTIFY_CONFIG;
    if(!cfg || !cfg.enabled) return;

    var text = '"' + guestName + '" (lista de ' + listName + ') ' + actionText + '.';

    if(cfg.method === 'telegram' && cfg.telegramBotToken && cfg.telegramChatId){
      fetch('https://api.telegram.org/bot' + cfg.telegramBotToken + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: cfg.telegramChatId, text: '💌 ' + text })
      }).catch(function(){ /* si falla el aviso, no interrumpe la confirmación */ });

    } else if(cfg.method === 'email' && window.emailjs && cfg.emailjsServiceId && cfg.emailjsTemplateId && cfg.emailjsPublicKey){
      window.emailjs.send(cfg.emailjsServiceId, cfg.emailjsTemplateId, {
        guest_name: guestName,
        list_name: listName,
        action: actionText,
        message: text
      }, cfg.emailjsPublicKey).catch(function(){ /* si falla el aviso, no interrumpe la confirmación */ });
    }
  }

  /* ---------- Listas de invitados (Silvia / Bea) ---------- */
  var STORAGE_KEY = 'tlbb-rsvp-v2';
  var groupsEl = document.getElementById('guestGroups');
  var guestSearch = document.getElementById('guestSearch');
  var guestEmpty = document.getElementById('guestEmpty');
  var lists = window.GUEST_LISTS || {};
  var allRows = [];

  function normalize(str){
    return str
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function loadState(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    }catch(e){
      return {};
    }
  }

  function saveState(state){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }catch(e){ /* almacenamiento no disponible: se pierde al recargar */ }
  }

  var state = loadState();

  if(groupsEl && Object.keys(lists).length){

    Object.keys(lists).forEach(function(listName){
      var guests = lists[listName] || [];
      if(!guests.length) return;

      var details = document.createElement('details');
      details.className = 'guest-group';

      var summary = document.createElement('summary');
      summary.textContent = 'Lista de ' + listName;
      details.appendChild(summary);

      var listEl = document.createElement('div');
      listEl.className = 'guest-list';
      details.appendChild(listEl);

      groupsEl.appendChild(details);

      guests.forEach(function(guest){
        var key = listName + ' · ' + guest.name;
        var saved = state[key] || {};

        var row = document.createElement('div');
        row.className = 'guest-row';
        row.setAttribute('data-search', normalize(guest.name));

        var nameEl = document.createElement('span');
        nameEl.className = 'guest-name';
        nameEl.textContent = guest.name;
        row.appendChild(nameEl);

        var actions = document.createElement('div');
        actions.className = 'guest-actions';

        var attendBtn = document.createElement('button');
        attendBtn.type = 'button';
        attendBtn.className = 'guest-toggle guest-attend';
        attendBtn.textContent = 'Asistir';
        actions.appendChild(attendBtn);

        var plusBtn = null;
        if(guest.plusOne){
          plusBtn = document.createElement('button');
          plusBtn.type = 'button';
          plusBtn.className = 'guest-toggle guest-plusone';
          plusBtn.textContent = '+1';
          actions.appendChild(plusBtn);
        }

        row.appendChild(actions);
        listEl.appendChild(row);
        allRows.push({ row: row, details: details });

        function applyAttend(on){
          attendBtn.classList.toggle('is-on', on);
          attendBtn.textContent = on ? 'Asiste ✓' : 'Asistir';
          row.classList.toggle('is-confirmed', on);
        }

        function applyPlusOne(on){
          if(!plusBtn) return;
          plusBtn.classList.toggle('is-on', on);
          plusBtn.textContent = on ? '+1 ✓' : '+1';
        }

        applyAttend(!!saved.confirmed);
        applyPlusOne(!!saved.plusOne);

        attendBtn.addEventListener('click', function(){
          var on = !attendBtn.classList.contains('is-on');
          applyAttend(on);
          state[key] = state[key] || {};
          state[key].confirmed = on;
          saveState(state);
          notifyRSVP(listName, guest.name, on ? 'confirma' : 'ha quitado su confirmación');
        });

        if(plusBtn){
          plusBtn.addEventListener('click', function(){
            var on = !plusBtn.classList.contains('is-on');
            applyPlusOne(on);
            state[key] = state[key] || {};
            state[key].plusOne = on;
            saveState(state);
            notifyRSVP(listName, guest.name, on ? 'añade un +1' : 'quita su +1');
          });
        }
      });
    });

    if(guestSearch){
      guestSearch.addEventListener('input', function(){
        var term = normalize(guestSearch.value);
        var hasTerm = term.length > 0;
        var visibleCount = 0;

        allRows.forEach(function(item){
          var match = !hasTerm || item.row.getAttribute('data-search').indexOf(term) !== -1;
          item.row.style.display = match ? '' : 'none';
          if(match){
            visibleCount++;
            if(hasTerm) item.details.open = true;
          }
        });

        if(!hasTerm){
          groupsEl.querySelectorAll('details').forEach(function(d){ d.open = false; });
        }

        if(guestEmpty) guestEmpty.hidden = visibleCount !== 0;
      });
    }
  }

})();

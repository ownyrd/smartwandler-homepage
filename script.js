// ── Mobile nav toggle ──
var navToggleBtn = document.querySelector('.nav-toggle');
if (navToggleBtn) {
  navToggleBtn.addEventListener('click', function () {
    document.querySelector('.nav-links').classList.toggle('open');
  });
}

// ── Tab switching für Leistungen-Section ──
function activateTab(targetId) {
  var found = false;
  document.querySelectorAll('.tabs .tab').forEach(function (t) {
    var isTarget = t.getAttribute('data-tab') === targetId;
    t.classList.toggle('active', isTarget);
    if (isTarget) found = true;
  });
  document.querySelectorAll('.tab-pane').forEach(function (p) {
    p.classList.toggle('active', p.getAttribute('data-pane') === targetId);
  });
  return found;
}

document.querySelectorAll('.tabs .tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    activateTab(tab.getAttribute('data-tab'));
  });
});

// ── Footer-Leistungen verlinken mit Tabs ──
document.querySelectorAll('[data-tab-link]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var target = link.getAttribute('data-tab-link');
    if (activateTab(target)) {
      e.preventDefault();
      var section = document.getElementById('leistungen');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      history.replaceState(null, '', '#leistungen-' + target);
    }
  });
});

// ── Beim Laden: Tab aus Hash aktivieren (#leistungen-ki etc.) ──
(function () {
  var hash = window.location.hash;
  var match = hash.match(/^#leistungen-(.+)$/);
  if (match && activateTab(match[1])) {
    var section = document.getElementById('leistungen');
    if (section) {
      setTimeout(function () {
        section.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 0);
    }
  }
})();

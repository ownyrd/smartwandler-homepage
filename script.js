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

// ── Über-uns Carousel ──
(function () {
  var track = document.querySelector('.carousel-track');
  if (!track) return;

  var slides = track.querySelectorAll('.carousel-slide');
  var dots = document.querySelectorAll('.carousel-dot');
  var btnPrev = document.querySelector('.carousel-btn-prev');
  var btnNext = document.querySelector('.carousel-btn-next');
  var current = 0;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.getAttribute('data-dot'), 10));
    });
  });
})();

// ── Scroll-Reveal (Fade-up) ──
// Nutzt native IntersectionObserver — keine Abhängigkeiten, sehr leichtgewichtig.
(function () {
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var selectors = [
    '.section-eyebrow',
    '.section-h2',
    '.bcard',
    '.tab-visual',
    '.process-step',
    '.carousel',
    '.compare-wrap',
    '.faq-item',
    '.cta-deco'
  ];
  var targets = document.querySelectorAll(selectors.join(','));

  if (prefersReduced || !('IntersectionObserver' in window)) {
    // Fallback: sofort sichtbar, keine Animation
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  targets.forEach(function (el) { el.classList.add('reveal'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  });

  targets.forEach(function (el) { observer.observe(el); });
})();

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

// ══════════════════════════════════════
// COOKIE CONSENT — DSGVO-konform
// Facebook Pixel wird NUR nach expliziter Einwilligung geladen.
// ══════════════════════════════════════
(function () {
  var CONSENT_KEY = 'cookie_consent_marketing';
  var banner = document.getElementById('cookie-consent');
  var btnAccept = document.getElementById('cookie-accept');
  var btnReject = document.getElementById('cookie-reject');
  var btnRevoke = document.getElementById('cookie-revoke');

  // TODO: Eigene Facebook Pixel ID hier eintragen
  var FB_PIXEL_ID = 'DEINE_PIXEL_ID';

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY); // 'granted' | 'denied' | null
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  // Facebook Pixel laden (nur einmal)
  function loadFacebookPixel() {
    if (window.fbq) return; // bereits geladen
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', FB_PIXEL_ID);
    fbq('track', 'PageView');
  }

  // Facebook Pixel entfernen & Cookies löschen
  function removeFacebookPixel() {
    // fbq-Objekt zurücksetzen
    if (window.fbq) {
      delete window.fbq;
      delete window._fbq;
    }
    // Facebook-Cookies löschen
    var fbCookies = ['_fbp', '_fbc'];
    fbCookies.forEach(function (name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  }

  function handleAccept() {
    setConsent('granted');
    hideBanner();
    loadFacebookPixel();
  }

  function handleReject() {
    setConsent('denied');
    hideBanner();
    removeFacebookPixel();
  }

  function handleRevoke() {
    localStorage.removeItem(CONSENT_KEY);
    removeFacebookPixel();
    showBanner();
  }

  // Event-Listener
  if (btnAccept) btnAccept.addEventListener('click', handleAccept);
  if (btnReject) btnReject.addEventListener('click', handleReject);
  if (btnRevoke) btnRevoke.addEventListener('click', handleRevoke);

  // Beim Laden: Consent prüfen
  var consent = getConsent();
  if (consent === 'granted') {
    loadFacebookPixel();
  } else if (consent === 'denied') {
    // Nutzer hat abgelehnt — nichts laden
  } else {
    // Kein Consent vorhanden — Banner zeigen
    showBanner();
  }
})();

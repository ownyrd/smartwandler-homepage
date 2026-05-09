// ── Mobile nav toggle ──
var navToggleBtn = document.querySelector('.nav-toggle');
if (navToggleBtn) {
  navToggleBtn.addEventListener('click', function () {
    document.querySelector('.nav-links').classList.toggle('open');
  });
}

// ── Open meetergo sidebar from CTA buttons ──
function openMeetergoSidebar(e) {
  var sidebarBtn = document.querySelector('.mg-sidebar-toggle');
  if (sidebarBtn) {
    e.preventDefault();
    sidebarBtn.click();
  }
  // If sidebar button not found, the link falls back to its href (opens meetergo externally)
  // Close mobile nav if open
  var navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.classList.remove('open');
}

document.querySelectorAll('.js-open-meetergo').forEach(function (link) {
  link.addEventListener('click', openMeetergoSidebar);
});


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
// Externe Dienste werden NUR nach expliziter Einwilligung geladen.
// ══════════════════════════════════════
(function () {
  var CONSENT_KEY_MEETERGO = 'cookie_consent_meetergo';
  var CONSENT_KEY_FACEBOOK = 'cookie_consent_facebook';

  var banner = document.getElementById('cookie-consent');
  var btnAccept = document.getElementById('cookie-accept');
  var btnReject = document.getElementById('cookie-reject');
  var btnRevoke = document.getElementById('cookie-revoke');
  var toggleMeetergo = document.getElementById('consent-meetergo');
  var toggleFacebook = document.getElementById('consent-facebook');

  // Eigene Facebook Pixel ID hier eintragen
  var FB_PIXEL_ID = '978129395179680';

  function showBanner() {
    if (!banner) return;
    // Restore toggle states from stored consent (for revoke scenario)
    // First visit: meetergo defaults to checked (set in HTML), facebook to unchecked
    var storedMeetergo = localStorage.getItem(CONSENT_KEY_MEETERGO);
    var storedFacebook = localStorage.getItem(CONSENT_KEY_FACEBOOK);
    if (toggleMeetergo && storedMeetergo !== null) toggleMeetergo.checked = storedMeetergo === 'granted';
    if (toggleFacebook && storedFacebook !== null) toggleFacebook.checked = storedFacebook === 'granted';
    banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  // ── meetergo ──
  function loadMeetergo() {
    if (document.querySelector('script[src*="browser-v4.js"]')) return;
    // Init sidebar config
    window.meetergo = window.meetergo || function () { (window.meetergo.q = window.meetergo.q || []).push(arguments); };
    meetergo('init', {
      sidebar: {
        position: 'right',
        width: '400px',
        link: 'https://cal.meetergo.com/philipp-anders/30-min-meeting',
        buttonText: 'Termin buchen',
        buttonIcon: 'CalendarPlus2',
        buttonPosition: 'middle-right',
        backgroundColor: '#C8A96A',
        textColor: '#3A3631'
      }
    });
    // Load the SDK
    var s = document.createElement('script');
    s.src = 'https://liv-showcase.s3.eu-central-1.amazonaws.com/browser-v4.js';
    s.defer = true;
    document.body.appendChild(s);
  }

  function removeMeetergo() {
    // Remove script
    var script = document.querySelector('script[src*="browser-v4.js"]');
    if (script) script.remove();
    // Remove sidebar elements
    var sidebar = document.querySelector('.mg-sidebar-toggle');
    if (sidebar) sidebar.remove();
    var sidebarPanel = document.querySelector('.mg-sidebar');
    if (sidebarPanel) sidebarPanel.remove();
    // Clean up global
    if (window.meetergo) delete window.meetergo;
  }

  // ── Facebook Pixel ──
  function loadFacebookPixel() {
    if (window.fbq) return;
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

  function removeFacebookPixel() {
    if (window.fbq) { delete window.fbq; delete window._fbq; }
    ['_fbp', '_fbc'].forEach(function (name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  }

  // ── Consent anwenden ──
  function applyConsent() {
    var meetergo = localStorage.getItem(CONSENT_KEY_MEETERGO);
    var facebook = localStorage.getItem(CONSENT_KEY_FACEBOOK);

    if (meetergo === 'granted') { loadMeetergo(); } else { removeMeetergo(); }
    if (facebook === 'granted') { loadFacebookPixel(); } else { removeFacebookPixel(); }
  }

  // ── Banner-Aktionen ──
  function handleAccept() {
    // Speichere individuelle Toggle-Werte
    localStorage.setItem(CONSENT_KEY_MEETERGO, toggleMeetergo && toggleMeetergo.checked ? 'granted' : 'denied');
    localStorage.setItem(CONSENT_KEY_FACEBOOK, toggleFacebook && toggleFacebook.checked ? 'granted' : 'denied');
    hideBanner();
    applyConsent();
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY_MEETERGO, 'denied');
    localStorage.setItem(CONSENT_KEY_FACEBOOK, 'denied');
    hideBanner();
    applyConsent();
  }

  function handleRevoke() {
    showBanner();
  }

  var btnAcceptAll = document.getElementById('cookie-accept-all');

  function handleAcceptAll() {
    localStorage.setItem(CONSENT_KEY_MEETERGO, 'granted');
    localStorage.setItem(CONSENT_KEY_FACEBOOK, 'granted');
    hideBanner();
    applyConsent();
  }

  // Event-Listener
  if (btnAccept) btnAccept.addEventListener('click', handleAccept);
  if (btnAcceptAll) btnAcceptAll.addEventListener('click', handleAcceptAll);
  if (btnReject) btnReject.addEventListener('click', handleReject);
  if (btnRevoke) btnRevoke.addEventListener('click', handleRevoke);

  // Beim Laden: Consent prüfen
  var hasConsent = localStorage.getItem(CONSENT_KEY_MEETERGO) !== null || localStorage.getItem(CONSENT_KEY_FACEBOOK) !== null;
  if (hasConsent) {
    applyConsent();
  } else {
    // Kein Consent vorhanden — Banner zeigen
    showBanner();
  }
})();

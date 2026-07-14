/* ══════════════════════════════════════
   POTENZIAL-CHECK — Frage-Engine + Ergebnis
   Backlog 1.1  · 7 Fragen · Fortschritt · mobil · schnell
   Backlog 1.2  · €-Rechnung client-side, Ausgabe als Spanne (aufs Team hochgerechnet)
   Backlog 1.3  · Ergebnis-Routing On-Premise / EU-Cloud / Festpreis
   Backlog 1.4  · Spitze sofort sichtbar + meetergo-Call-Button
   Backlog 1.5  · Mail-Gate (E-Mail + Name + freiwillige, nicht
                  vorangekreuzte Checkbox) → POST an submit.php (2.5)
   ------------------------------------------------------
   Bewusst Vanilla-JS, kein Framework (Ad-Landingpage → schnelle Ladezeit).
   ══════════════════════════════════════ */
(function () {
  'use strict';

  // ── Die 7 Fragen (final, CONTEXT.md Abschnitt 4) · durchgängig Sie-Form (C7) ──
  // value  = maschinenlesbarer Schlüssel (u.a. Seed-Kriterium C4/C5)
  // label  = Alltagssprache für den Nutzer
  // reveal = optionales Freitext-/Zahlenfeld, das bei Auswahl dieser Option erscheint
  var QUESTIONS = [
    {
      id: 'branche',
      title: 'In welcher Branche sind Sie unterwegs?',
      hint: 'Wählen Sie, was am ehesten passt.',
      type: 'single',
      options: [
        { value: 'handwerk_bau',       label: 'Handwerk / Bau' },
        { value: 'handel_ecommerce',   label: 'Handel / E-Commerce' },
        { value: 'dienstleistung',     label: 'Dienstleistung / Beratung' },
        { value: 'produktion',         label: 'Produktion / Fertigung' },
        { value: 'gesundheit_pflege', label: 'Gesundheit / Pflege' },
        { value: 'kanzlei',            label: 'Kanzlei (Anwalt / Steuer / Notar)' },
        { value: 'sonstige',           label: 'Sonstige',
          reveal: { key: 'branche_custom', type: 'text', label: 'Welche Branche?', placeholder: 'z. B. Logistik' } }
      ]
    },
    {
      id: 'mitarbeiter',
      title: 'Wie viele Mitarbeitende hat Ihr Betrieb?',
      hint: null,
      type: 'single',
      options: [
        { value: '1_4',      label: '1 bis 4' },
        { value: '5_20',     label: '5 bis 20' },
        { value: '21_50',    label: '21 bis 50' },
        { value: 'ueber_50', label: 'über 50' }
      ]
    },
    {
      id: 'rolle',
      title: 'Welche Rolle haben Sie im Unternehmen?',
      hint: null,
      type: 'single',
      options: [
        { value: 'inhaber_gf',        label: 'Inhaber:in / Geschäftsführung' },
        { value: 'geschaeftsleitung', label: 'Geschäftsleitung / Prokura' },
        { value: 'it_projekt',        label: 'IT- / Projektverantwortlich' },
        { value: 'mitarbeiter',       label: 'Mitarbeiter:in ohne Budgetentscheidung' }
      ]
    },
    {
      id: 'zeitfresser',
      title: 'Wo verliert Ihr Team am meisten Zeit mit wiederkehrender Arbeit?',
      hint: 'Mehrfachauswahl möglich.',
      type: 'multi',
      options: [
        { value: 'angebote_rechnungen', label: 'Angebote / Rechnungen schreiben' },
        { value: 'daten_doppelt',       label: 'Daten in verschiedene, unabhängige Systeme doppelt eintippen' },
        { value: 'emails',              label: 'E-Mails sortieren & beantworten' },
        { value: 'dokumente',           label: 'Dokumente suchen & ablegen' },
        { value: 'koordination',        label: 'Termine / Aufträge / Einsätze koordinieren' },
        { value: 'berichte',            label: 'Berichte / Protokolle / Doku erstellen' }
      ]
    },
    {
      id: 'stunden',
      title: 'Wie viele Stunden pro Woche verbringt bei Ihnen ein:e typische:r Mitarbeiter:in mit solchen Routineaufgaben?',
      hint: 'Grobe Schätzung pro Kopf genügt, wir rechnen es auf Ihr Team hoch.',
      type: 'single',
      options: [
        { value: 'unter_5',     label: 'Unter 5 Stunden' },
        { value: '5_10',        label: '5 bis 10 Stunden' },
        { value: '10_20',       label: '10 bis 20 Stunden' },
        { value: 'ueber_20',    label: 'Über 20 Stunden' },
        { value: 'weiss_nicht', label: 'Weiß ich nicht genau' },
        { value: 'manuell',     label: 'Ich gebe es genau an',
          reveal: { key: 'stunden_custom', type: 'number', label: 'Stunden pro Mitarbeiter & Woche',
                    placeholder: 'z. B. 8', min: 0, max: 60, unit: 'h/Woche pro Kopf' } }
      ]
    },
    {
      id: 'zufriedenheit',
      title: 'Wie zufrieden sind Sie mit Ihrer heutigen Lösung?',
      hint: null,
      type: 'single',
      options: [
        { value: 'software_teuer', label: 'Läuft, aber die Software ist zu teuer / passt nicht' },
        { value: 'cloud_unwohl',   label: 'Läuft, aber die Daten liegen in Clouds, bei denen ich kein gutes Gefühl habe' },
        { value: 'manuell',        label: 'Nicht zufrieden, vieles läuft noch manuell' },
        { value: 'unsicher',       label: 'Bin unsicher, was überhaupt geht' }
      ]
    },
    {
      id: 'dringlichkeit',
      title: 'Wie schnell möchten Sie die Automatisierung in Ihrem Unternehmen verbessern?',
      hint: null,
      type: 'single',
      options: [
        { value: 'asap',        label: 'So schnell wie möglich' },
        { value: 'monate',      label: 'In den nächsten Monaten' },
        { value: 'informieren', label: 'Erstmal nur informieren' }
      ]
    }
  ];

  // ── Ergebnis-Logik-Parameter (leicht anpassbar) ──
  // Stunden Routinearbeit PRO KOPF / Woche je Bucket (Frage 5):
  var HOURS_MEAN = { unter_5: 3, '5_10': 7.5, '10_20': 15, ueber_20: 25, weiss_nicht: 8 };
  // Repräsentative Mitarbeiterzahl je Bucket (Frage 2) — bewusst konservativ,
  // damit große Betriebe keine Fantasiezahlen bekommen:
  var HEADCOUNT_REP = { '1_4': 2, '5_20': 10, '21_50': 30, ueber_50: 60 };
  var AUTOMATABLE = 0.40;   // Anteil automatisierbar
  var WEEKS = 45;           // Arbeitswochen / Jahr
  var HOURLY = 35;          // € / Stunde
  var SPREAD = 0.25;        // ±25 % → Spanne statt Scheinpräzision
  var HOURS_CAP = 60;       // Sanity-Cap für manuelle Eingabe (h/Kopf/Woche)

  // ── State ──
  var state = {
    index: 0,
    answers: {},   // { fragenId: value | [values], branche_custom, stunden_custom }
    result: null,  // { min, max, routing, heads, perEmp }
    stepSeen: 0    // höchste bereits getrackte Frage (verhindert Doppel-Events bei „Zurück")
  };

  // ── DOM ──
  var app = document.getElementById('pc-app');
  if (!app) return;
  var screens = {
    intro:  app.querySelector('[data-screen="intro"]'),
    quiz:   app.querySelector('[data-screen="quiz"]'),
    result: app.querySelector('[data-screen="result"]')
  };
  var elQuestion  = document.getElementById('pc-question');
  var elStep      = document.getElementById('pc-step');
  var elTotal     = document.getElementById('pc-total');
  var elFill      = document.getElementById('pc-progress-fill');
  var elNext      = document.getElementById('pc-next');
  var elMultiHint = document.getElementById('pc-multi-hint');

  elTotal.textContent = QUESTIONS.length;

  // ══════════════════════════════════════
  // Screen-Wechsel
  // ══════════════════════════════════════
  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle('is-active', key === name);
    });
    var active = screens[name];
    active.classList.remove('is-active');
    void active.offsetWidth; // reflow → Fade-Animation neu auslösen
    active.classList.add('is-active');
  }

  // ══════════════════════════════════════
  // Fragen (1.1)
  // ══════════════════════════════════════
  function renderQuestion() {
    var q = QUESTIONS[state.index];
    var current = state.answers[q.id];

    // Funnel-Event pro Frage, nur beim ersten Erreichen (nicht bei „Zurück").
    if (state.index + 1 > state.stepSeen) {
      state.stepSeen = state.index + 1;
      trackFunnel('frage_' + (state.index + 1));
    }

    elStep.textContent = state.index + 1;
    elFill.style.width = (state.index / QUESTIONS.length * 100) + '%';
    elMultiHint.hidden = q.type !== 'multi';

    var html = '';
    html += '<h2 class="pc-q-title">' + escapeHtml(q.title) + '</h2>';
    if (q.hint) html += '<p class="pc-q-hint">' + escapeHtml(q.hint) + '</p>';
    html += '<div class="pc-options" data-type="' + q.type + '" role="' +
            (q.type === 'multi' ? 'group' : 'radiogroup') + '">';
    q.options.forEach(function (opt) {
      var selected = q.type === 'multi'
        ? Array.isArray(current) && current.indexOf(opt.value) !== -1
        : current === opt.value;
      html += '<button type="button" class="pc-option' + (selected ? ' is-selected' : '') +
              '" data-value="' + escapeHtml(opt.value) + '"' +
              ' role="' + (q.type === 'multi' ? 'checkbox' : 'radio') + '"' +
              ' aria-checked="' + (selected ? 'true' : 'false') + '">' +
              '<span class="pc-option-mark" aria-hidden="true"></span>' +
              '<span class="pc-option-label">' + escapeHtml(opt.label) + '</span>' +
              '</button>';
    });
    html += '</div>';
    html += '<div class="pc-reveal" id="pc-reveal" data-key="" hidden></div>';
    elQuestion.innerHTML = html;

    Array.prototype.forEach.call(elQuestion.querySelectorAll('.pc-option'), function (btn) {
      btn.addEventListener('click', function () { onSelect(q, btn.getAttribute('data-value')); });
    });

    updateReveal(q, false);
    updateNextState(q);
    var first = elQuestion.querySelector('.pc-option');
    if (first) first.focus({ preventScroll: true });
  }

  // Auswahl — KEIN Auto-Advance: Nutzer klickt selbst auf „Weiter".
  function onSelect(q, value) {
    if (q.type === 'multi') {
      var arr = Array.isArray(state.answers[q.id]) ? state.answers[q.id].slice() : [];
      var pos = arr.indexOf(value);
      if (pos === -1) arr.push(value); else arr.splice(pos, 1);
      state.answers[q.id] = arr;
    } else {
      state.answers[q.id] = value;
    }
    syncSelection(q);
    updateReveal(q, true);
    updateNextState(q);
  }

  function syncSelection(q) {
    var current = state.answers[q.id];
    Array.prototype.forEach.call(elQuestion.querySelectorAll('.pc-option'), function (btn) {
      var v = btn.getAttribute('data-value');
      var on = q.type === 'multi'
        ? Array.isArray(current) && current.indexOf(v) !== -1
        : current === v;
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  // Freitext-/Zahlenfeld zur aktuell gewählten Option ein-/ausblenden.
  function selectedRevealOption(q) {
    if (q.type !== 'single') return null;
    var opt = optionByValue(q, state.answers[q.id]);
    return opt && opt.reveal ? opt : null;
  }

  function updateReveal(q, focusInput) {
    var host = elQuestion.querySelector('#pc-reveal');
    if (!host) return;
    var opt = selectedRevealOption(q);
    if (!opt) { host.hidden = true; return; }

    var r = opt.reveal;
    if (host.getAttribute('data-key') !== r.key) {
      host.setAttribute('data-key', r.key);
      var stored = state.answers[r.key] != null ? state.answers[r.key] : '';
      var attrs = r.type === 'number'
        ? ' inputmode="numeric" min="' + (r.min || 0) + '" max="' + (r.max || 999) + '"'
        : '';
      host.innerHTML =
        '<label class="pc-reveal-field">' +
          '<span class="pc-field-label">' + escapeHtml(r.label) + '</span>' +
          '<span class="pc-reveal-input">' +
            '<input type="' + r.type + '"' + attrs +
              ' placeholder="' + escapeHtml(r.placeholder || '') + '"' +
              ' value="' + escapeHtml(stored) + '">' +
            (r.unit ? '<span class="pc-reveal-unit">' + escapeHtml(r.unit) + '</span>' : '') +
          '</span>' +
        '</label>';
      var input = host.querySelector('input');
      input.addEventListener('input', function () {
        state.answers[r.key] = input.value.trim();
        updateNextState(q);
      });
      if (focusInput) input.focus({ preventScroll: true });
    }
    host.hidden = false;
  }

  function isAnswered(q) {
    if (q.type === 'multi') {
      var a = state.answers[q.id];
      return Array.isArray(a) && a.length > 0;
    }
    var v = state.answers[q.id];
    if (!v) return false;
    var opt = optionByValue(q, v);
    if (opt && opt.reveal) {
      var cv = state.answers[opt.reveal.key];
      if (opt.reveal.type === 'number') {
        var n = parseFloat(cv);
        return !isNaN(n) && n > 0;
      }
      return cv != null && String(cv).trim().length > 0;
    }
    return true;
  }

  function updateNextState(q) {
    elNext.disabled = !isAnswered(q);
    elNext.textContent = state.index === QUESTIONS.length - 1 ? 'Ergebnis anzeigen  →' : 'Weiter  →';
  }

  // ══════════════════════════════════════
  // Navigation
  // ══════════════════════════════════════
  function next() {
    var q = QUESTIONS[state.index];
    if (!isAnswered(q)) return;
    if (state.index < QUESTIONS.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function back() {
    if (state.index > 0) {
      state.index--;
      renderQuestion();
    } else {
      showScreen('intro'); // von Frage 1 zurück → Intro
    }
  }

  function start() {
    state.index = 0;
    trackFunnel('check_gestartet');
    showScreen('quiz');
    renderQuestion();
  }

  function restart() {
    state.index = 0;
    state.answers = {};
    state.result = null;
    state.stepSeen = 0;
    elFill.style.width = '0%';
    resetGate();
    showScreen('intro');
  }

  // ══════════════════════════════════════
  // Ergebnis-Berechnung (1.2) — pro Kopf × Team, Ausgabe als Spanne
  // ══════════════════════════════════════
  function perEmployeeHours(answers) {
    if (answers.stunden === 'manuell') {
      var n = parseFloat(answers.stunden_custom);
      if (isNaN(n) || n < 0) n = 0;
      return Math.min(n, HOURS_CAP);
    }
    var m = HOURS_MEAN[answers.stunden];
    return m == null ? HOURS_MEAN.weiss_nicht : m;
  }

  function teamSize(answers) {
    return HEADCOUNT_REP[answers.mitarbeiter] || 1;
  }

  function computeRange(answers) {
    var perEmp = perEmployeeHours(answers);
    var heads  = teamSize(answers);
    var weeklyTeamHours = perEmp * heads;
    var annual = weeklyTeamHours * AUTOMATABLE * WEEKS * HOURLY;
    return {
      min: niceRound(annual * (1 - SPREAD)),
      max: niceRound(annual * (1 + SPREAD)),
      perEmp: perEmp,
      heads: heads
    };
  }

  // ══════════════════════════════════════
  // Routing (1.3) — Ergebnis-Text + Call-Button aus Frage 1 + 6.
  // On-Premise / EU-Cloud / DSGVO ist der Differenzierer IM ERGEBNIS,
  // NICHT der Ad-Hook.
  // ══════════════════════════════════════
  function computeRouting(answers) {
    var sensibleBranche = answers.branche === 'gesundheit_pflege' || answers.branche === 'kanzlei';
    if (answers.zufriedenheit === 'cloud_unwohl' || sensibleBranche) {
      return {
        key: 'datensicher',
        subline: '30 Minuten, kostenlos. Und ja, Ihre Daten bleiben, wo Sie sie haben ' +
                 'wollen: DSGVO-konform in der EU-Cloud oder komplett bei Ihnen vor Ort.',
        cta: 'Datensichere Lösung besprechen  →'
      };
    }
    if (answers.zufriedenheit === 'software_teuer') {
      return {
        key: 'festpreis',
        subline: '30 Minuten, kostenlos. Kein Abo, keine laufenden Lizenzkosten. ' +
                 'Wir arbeiten mit Festpreis.',
        cta: 'Festpreis-Lösung besprechen  →'
      };
    }
    return {
      key: 'standard',
      subline: '30 Minuten, kostenlos: Wir schauen uns Ihre Top-Zeitfresser an und ' +
               'Sie bekommen konkrete Ansatzpunkte.',
      cta: 'Kostenloses Erstgespräch buchen  →'
    };
  }

  // ── Einordnung (②): personalisiert nach dem Top-Zeitfresser (Frage 4) ──
  var ZEITFRESSER_PHRASE = {
    angebote_rechnungen: 'beim Schreiben von Angeboten und Rechnungen',
    daten_doppelt:       'beim doppelten Eintippen von Daten in verschiedene Systeme',
    emails:              'beim Sortieren und Beantworten von E-Mails',
    dokumente:           'beim Suchen und Ablegen von Dokumenten',
    koordination:        'bei der Koordination von Terminen, Aufträgen und Einsätzen',
    berichte:            'beim Erstellen von Berichten, Protokollen und Dokumentation'
  };

  function topZeitfresser(answers) {
    var sel = answers.zeitfresser;
    if (!sel || !sel.length) return null;
    // „Top" = erster in der Fragen-Reihenfolge, den der Nutzer gewählt hat.
    var q = optionSet('zeitfresser');
    for (var i = 0; q && i < q.options.length; i++) {
      if (sel.indexOf(q.options[i].value) !== -1) return q.options[i].value;
    }
    return sel[0];
  }

  function computeEinordnung(answers) {
    var phrase = ZEITFRESSER_PHRASE[topZeitfresser(answers)];
    if (phrase) {
      return 'Auf Basis Ihrer Angaben verliert Ihr Team vor allem ' + phrase +
             ' spürbar Zeit. Ein großer Teil davon lässt sich automatisieren, ' +
             'ohne dass Sie Ihre Arbeitsweise umkrempeln müssen.';
    }
    return 'Auf Basis Ihrer Angaben ist bei Ihnen einiges an Zeit in wiederkehrender ' +
           'Routinearbeit gebunden. Ein großer Teil davon lässt sich automatisieren, ' +
           'ohne dass Sie Ihre Arbeitsweise umkrempeln müssen.';
  }

  function optionSet(id) {
    return QUESTIONS.filter(function (x) { return x.id === id; })[0] || null;
  }

  // ══════════════════════════════════════
  // Ergebnisseite (1.4) — Spitze sofort sichtbar, ohne Mail (C6)
  // ══════════════════════════════════════
  function finish() {
    elFill.style.width = '100%';

    var range = computeRange(state.answers);
    var routing = computeRouting(state.answers);
    state.result = {
      min: range.min, max: range.max, routing: routing.key,
      heads: range.heads, perEmp: range.perEmp
    };

    document.getElementById('pc-range').textContent =
      formatEUR(range.min) + ' bis ' + formatEUR(range.max) + ' €';
    document.getElementById('pc-range-basis').textContent =
      'Hochgerechnet auf ~' + range.heads + ' Mitarbeitende × ~' + formatNum(range.perEmp) +
      ' h/Woche pro Kopf · davon rund ' + Math.round(AUTOMATABLE * 100) + ' % automatisierbar.';
    var einordnung = document.getElementById('pc-einordnung');
    if (einordnung) einordnung.textContent = computeEinordnung(state.answers);
    var ctaBtn = document.getElementById('pc-cta-call');
    if (ctaBtn) ctaBtn.textContent = routing.cta;
    var ctaSub = document.getElementById('pc-cta-subline');
    if (ctaSub) ctaSub.textContent = routing.subline;

    renderSummary();
    resetGate();
    showScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Tracking-Hooks (Epic 3)
    trackFunnel('ergebnis_gezeigt');
    trackLead(); // Lead + ggf. QualifiedLead (C4) — nur wenn Pixel per Consent geladen
  }

  function renderSummary() {
    var box = document.getElementById('pc-result-summary');
    if (!box) return;
    var short = {
      branche: 'Branche', mitarbeiter: 'Mitarbeitende', rolle: 'Rolle',
      zeitfresser: 'Zeitfresser', stunden: 'Routine / Kopf',
      zufriedenheit: 'Heutige Lösung', dringlichkeit: 'Zeithorizont'
    };
    box.innerHTML = QUESTIONS.map(function (q) {
      return '<div class="pc-summary-row"><span class="pc-summary-q">' +
             escapeHtml(short[q.id] || q.id) + '</span><span class="pc-summary-a">' +
             escapeHtml(summaryValue(q) || '…') + '</span></div>';
    }).join('');
  }

  function summaryValue(q) {
    var a = state.answers[q.id];
    if (q.type === 'multi') {
      return Array.isArray(a) ? a.map(function (v) { return labelFor(q, v); }).join(', ') : '';
    }
    if (q.id === 'branche' && a === 'sonstige' && state.answers.branche_custom) {
      return 'Sonstige: ' + state.answers.branche_custom;
    }
    if (q.id === 'stunden' && a === 'manuell' && state.answers.stunden_custom) {
      return state.answers.stunden_custom + ' h/Woche pro Kopf';
    }
    return labelFor(q, a);
  }

  // ══════════════════════════════════════
  // Mail-Gate (1.5) — Report = transaktional (immer). Nurture = separate,
  // NICHT vorangekreuzte, FREIWILLIGE Checkbox (C2, kein Pflichtfeld).
  // ══════════════════════════════════════
  var gateForm    = document.getElementById('pc-gate-form');
  var gateWrap    = document.getElementById('pc-gate');
  var gateSuccess = document.getElementById('pc-gate-success');
  var gateError   = document.getElementById('pc-gate-error');

  function resetGate() {
    if (gateForm) {
      gateForm.reset();
      var b = gateForm.querySelector('.pc-gate-submit');
      b.disabled = false;
      b.textContent = 'Report anfordern  →';
    }
    if (gateWrap) gateWrap.hidden = false;
    if (gateSuccess) gateSuccess.hidden = true;
    if (gateError) { gateError.hidden = true; gateError.textContent = ''; }
  }

  function showGateError(msg) {
    if (!gateError) return;
    gateError.textContent = msg;
    gateError.hidden = false;
  }

  function onGateSubmit(e) {
    e.preventDefault();
    if (!gateForm) return;
    var name    = gateForm.name.value.trim();
    var email   = gateForm.email.value.trim();
    var consent = gateForm.consent.checked; // freiwillig, kein Pflichtfeld

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showGateError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      gateForm.email.focus();
      return;
    }
    gateError.hidden = true;

    var payload = {
      antworten: state.answers,
      name: name,
      email: email,
      consent: consent,
      ergebnis_min: state.result ? state.result.min : null,
      ergebnis_max: state.result ? state.result.max : null
    };

    var submitBtn = gateForm.querySelector('.pc-gate-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet …';

    // submit.php entsteht in Backlog 2.5 (Insert + Brevo Transactional + ggf. Contacts→DOI).
    fetch('submit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json().catch(function () { return {}; });
      })
      .then(function () {
        gateWrap.hidden = true;
        gateSuccess.hidden = false;
        document.getElementById('pc-gate-success-msg').textContent = consent
          ? 'Bitte bestätigen Sie noch kurz die E-Mail, die wir Ihnen geschickt haben, dann ist alles startklar.'
          : 'Schauen Sie in Ihr Postfach: Ihr Report ist unterwegs.';
        trackFunnel('report_angefordert');
      })
      .catch(function (err) {
        console.error('[potenzialcheck] submit fehlgeschlagen:', err);
        showGateError('Das Absenden hat gerade nicht geklappt. Bitte versuchen Sie es in einem Moment erneut.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Report anfordern  →';
      });
  }

  if (gateForm) gateForm.addEventListener('submit', onGateSubmit);

  // ══════════════════════════════════════
  // Tracking-Hooks (Epic 3)
  //  · Matomo-Funnel: läuft über die cookielose Basis für ALLE (C3).
  //  · Meta Lead/QualifiedLead: Browser-Pixel + Server-CAPI (s-event.php) mit
  //    gemeinsamer event_id (Dedup), NUR bei Facebook-Consent (C4), ohne PII.
  // ══════════════════════════════════════
  function trackFunnel(step) {
    try {
      if (window._paq) window._paq.push(['trackEvent', 'Potenzialcheck', step]);
    } catch (e) { /* still */ }
  }
  function trackLead() {
    // C4: QualifiedLead nur bei Entscheidern kleiner Betriebe.
    // Mitarbeiter „1–4" ODER „5–20"  UND  Rolle „Inhaber/GF" ODER „Geschäftsleitung/Prokura".
    var maOk = state.answers.mitarbeiter === '1_4' || state.answers.mitarbeiter === '5_20';
    var rolleOk = state.answers.rolle === 'inhaber_gf' || state.answers.rolle === 'geschaeftsleitung';
    var qualified = maOk && rolleOk;
    sendMetaEvent('Lead', false);
    if (qualified) sendMetaEvent('QualifiedLead', true);
    trackFunnel(qualified ? 'lead_qualified' : 'lead');
  }

  // Ein Meta-Event über Browser-Pixel UND Server-CAPI mit gemeinsamer event_id
  // (Meta dedupliziert). Gating identisch zur restlichen Seite: nur bei erteiltem
  // Facebook-Consent. Kein PII im Event — Match nur über fbp/fbc + serverseitig IP/UA.
  function sendMetaEvent(name, isCustom) {
    if (localStorage.getItem('cookie_consent_facebook') !== 'granted') return;
    var eventId = fbUuid();
    try {
      if (typeof window.fbq === 'function') {
        window.fbq(isCustom ? 'trackCustom' : 'track', name, {}, { eventID: eventId });
      }
    } catch (e) { /* still */ }
    try {
      fetch('../s-event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          event_name: name,
          event_source_url: window.location.href,
          fbp: fbGetCookie('_fbp'),
          fbc: fbGetCookie('_fbc')
        }),
        credentials: 'same-origin',
        keepalive: true
      }).catch(function () { /* best effort */ });
    } catch (e) { /* still */ }
  }

  function fbGetCookie(name) {
    var m = document.cookie.match('(^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[2]) : null;
  }

  function fbUuid() {
    if (window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // ══════════════════════════════════════
  // Utils
  // ══════════════════════════════════════
  function optionByValue(q, value) {
    return q.options.filter(function (o) { return o.value === value; })[0] || null;
  }
  function labelFor(q, value) {
    var opt = optionByValue(q, value);
    return opt ? opt.label : '';
  }
  function niceRound(n) {
    if (n >= 20000) return Math.round(n / 1000) * 1000;
    if (n >= 5000)  return Math.round(n / 500) * 500;
    return Math.round(n / 100) * 100;
  }
  function formatEUR(n) { return n.toLocaleString('de-DE'); }
  function formatNum(n) { return Number(n).toLocaleString('de-DE'); }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ── Aktionen (data-action) ──
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    if (action === 'start')   { e.preventDefault(); start(); }
    if (action === 'next')    { e.preventDefault(); next(); }
    if (action === 'back')    { e.preventDefault(); back(); }
    if (action === 'restart') { e.preventDefault(); restart(); }
  });

  // Enter → weiter (wenn beantwortet, aber nicht während Feld-/Option-Fokus)
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (!screens.quiz.classList.contains('is-active')) return;
    var ae = document.activeElement;
    if (ae && (ae.classList.contains('pc-option') || ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
    if (!elNext.disabled) { e.preventDefault(); next(); }
  });

  // Öffentliche Hook (für weitere Ausbaustufen / Tests)
  window.pcCheck = {
    get answers() { return state.answers; },
    get result() { return state.result; },
    questions: QUESTIONS,
    start: start,
    restart: restart
  };
})();

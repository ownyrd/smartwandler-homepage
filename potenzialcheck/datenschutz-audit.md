# Datenschutz-Audit smartwandler.de (Stand: 16.07.2026)

Geprüft: alle Seiten, `script.js`, `potenzialcheck/check.js`, `potenzialcheck/submit.php`,
`s-event.php`, Cookie-Banner, E-Mail-Templates — abgeglichen mit `datenschutz.html`
und CONTEXT.md Punkt 7.

> Hinweis: Kein Rechtsrat. Die `[R]`-Punkte vom Datenschutzbeauftragten/Fachanwalt
> absegnen lassen (so sieht es CONTEXT.md selbst vor).

═══════════════════════════════════════════════════════════════════════════════
✅ WAS SAUBER IST
═══════════════════════════════════════════════════════════════════════════════

- **Pixel + Conversions API nur nach Einwilligung:** `check.js:602` und
  `termin-gebucht.html` prüfen beide `cookie_consent_facebook === 'granted'` vor
  Browser-Pixel UND CAPI-Call. Deckt sich mit der DSE-Aussage „ohne Einwilligung
  keine Übermittlung".
- **Matomo:** `requireCookieConsent` + `setDoNotTrack` (`script.js:318-320`),
  Opt-out-Schalter auf der Datenschutzseite funktioniert. Funnel-Events senden
  NUR Schrittnamen, keine Antworten (`check.js:584`) — konsistent mit „Ihre
  Angaben werden nicht übertragen".
- **Kopplungsverbot (C2):** Newsletter-Checkbox freiwillig, nicht vorangekreuzt,
  Double-Opt-In-Flow vorhanden.
- **Keine Google Fonts auf der Website** (Inter lokal eingebunden). Google-Fonts-
  Einbindung existiert nur in den Ad-Creative-Entwürfen (`meta-creatives/`), die
  nicht Teil der verlinkten Website sind.
- **DSE deckt ab:** Potenzial-Check, MySQL-Speicherung, Brevo, Matomo (2-stufig),
  Meta-Pixel UND Conversions API (inkl. IP/UA/fbp/fbc — überdurchschnittlich
  vollständig).
- **autoConfig aus** beim Pixel (`script.js:261`): verhindert Metas automatisches
  Absaugen von Button-Texten/Formularinhalten (C4, kein PII an Meta).

═══════════════════════════════════════════════════════════════════════════════
✅ PUNKT 1 — BREVO-AUSSAGE KORRIGIERT (16.07.2026 in datenschutz.html umgesetzt)
═══════════════════════════════════════════════════════════════════════════════

**Fundstelle:** `datenschutz.html:246` sagt wörtlich:
„fordern Sie nur den Report an, werden diese Angaben nicht an Brevo übertragen."

**Realität:** `submit.php:168-192` sendet ALLE Check-Antworten (Branche,
Mitarbeiter, Rolle, Zeitfresser, Stunden, Zufriedenheit, Dringlichkeit) als
Template-`params` an die Brevo-API — bei JEDEM Report, auch ohne
Newsletter-Häkchen, weil Brevo sie zum Rendern der Report-Mail braucht.
Der echte Unterschied: Ohne Consent werden sie nicht dauerhaft als
KONTAKTATTRIBUTE gespeichert.

**Fix:** Satz präzisieren, z. B.:
„Zur Erstellung der Report-E-Mail werden Ihre Angaben an Brevo übermittelt und
dort im Rahmen des Versands verarbeitet; eine dauerhafte Speicherung als
Kontaktmerkmale erfolgt nur bei Newsletter-Anmeldung."

═══════════════════════════════════════════════════════════════════════════════
✅ PUNKT 2 — MEETERGO-RECHTSGRUNDLAGE KORRIGIERT (16.07.2026: Einbettung jetzt
   Art. 6 I a + § 25 I TDDDG, externe Buchungsseite Art. 6 I f)
═══════════════════════════════════════════════════════════════════════════════

- DSE (`datenschutz.html:225`) nennt Art. 6 Abs. 1 lit. f (berechtigtes Interesse).
- Der Banner behandelt meetergo aber als EINWILLIGUNGSPFLICHTIG (Funktional-Toggle,
  Default aus; SDK lädt erst nach Zustimmung).
- Da das SDK von einem Drittserver lädt (§ 25 TDDDG), ist Einwilligung die richtige
  Basis für die EINBETTUNG. DSE sollte Art. 6 I a + § 25 I TDDDG nennen;
  Art. 6 I f passt nur für die extern verlinkte Buchungsseite.
- Nebenbefund: Das SDK lädt von AWS S3
  (`liv-showcase.s3.eu-central-1.amazonaws.com`, `script.js:215`) — Region
  Frankfurt, aber die Aussage „Server von meetergo in Deutschland" ist dadurch
  nur halb präzise (AWS als Unterauftragsverarbeiter von meetergo).

═══════════════════════════════════════════════════════════════════════════════
🟡 PUNKT 3 — LÖSCHKONZEPT: SKRIPT ERSTELLT, CRONJOB NOCH EINRICHTEN
   (16.07.2026: cleanup-leads.php liegt bereit — siehe Fix unten.
   OFFEN: cleanup_token in submit-config.php setzen + all-inkl Cronjob anlegen.
   OFFEN: quartalsweises Brevo-Aufräumen als Kalender-Task.)
═══════════════════════════════════════════════════════════════════════════════

- DSE verspricht Löschung „spätestens nach 24 Monaten" (`datenschutz.html:239`),
  CONTEXT.md fordert das Löschkonzept `[R]`.
- Es gibt aber KEINEN Lösch-Mechanismus im Code (kein Cron, kein Skript,
  nichts `created_at`-basiertes).
- Dokumentiertes Versprechen ohne Prozess = Risiko bzgl. Art. 5 I e DSGVO
  (Speicherbegrenzung).

**Geltungsbereich — was wo gelöscht werden muss:**

Das 24-Monate-Versprechen betrifft nur die MySQL-DB. MySQL (Art. 6 I b/f) und
Brevo-Kontakt (Einwilligung) sind getrennte Rechtsgrundlagen (CONTEXT.md C5) —
der Lösch-Cron kann also alle nicht-konvertierten Leads > 24 Monate löschen,
unabhängig vom Newsletter-Status; der Brevo-Kontakt bleibt davon unberührt.

| Datenbestand                          | Löschregel                                        |
|---------------------------------------|---------------------------------------------------|
| MySQL-Leads (nicht konvertiert)        | Cron: > 24 Monate löschen (das Kernproblem hier)  |
| Brevo: aktiver Newsletter-Abonnent     | unbegrenzt okay — Einwilligung trägt, solange Abo läuft |
| Brevo: DOI angefragt, NIE bestätigt    | nach ~30 Tagen aufräumen (oft übersehen!)         |
| Brevo: abgemeldet (unsubscribed)       | Attribute/Daten bereinigen; nur DOI-Nachweis (E-Mail + Zeitstempel) und Sperrvermerk behalten |

**Zwei Brevo-Lücken (Annahme „Brevo vergisst sowieso" stimmt nicht ganz):**

1. **Unbestätigte DOI-Kontakte bleiben liegen.** Kreuzt jemand die Checkbox an,
   bestätigt aber die DOI-Mail nie, legt `submit.php` über
   `doubleOptinConfirmation` trotzdem einen Kontakt MIT Attributen in Brevo an.
   Brevo löscht den nicht automatisch — und es existiert keine wirksame
   Einwilligung (DOI nie abgeschlossen). → Nach angemessener Frist (~30 Tage)
   löschen; bei geringem Volumen manuell, sonst Brevo-Automation.

2. **Abgemeldete Kontakte löscht Brevo nicht.** Abmeldung = nur Markierung
   „unsubscribed", alle Daten bleiben. Nach Widerruf entfällt die
   Rechtsgrundlage für die inhaltlichen Daten (z. B. Check-Antworten als
   Attribute). Behalten werden darf: der Einwilligungs-Nachweis
   (Rechtsverteidigung) und die Adresse als Sperrvermerk gegen erneutes
   Anschreiben. → Gelegentlich bereinigen.

**Fix:**
- Lösch-Cron auf dem Server einrichten, z. B.
  `DELETE FROM leads WHERE created_at < NOW() - INTERVAL 24 MONTH AND confirmed_at IS NULL`
  (oder wiederkehrender Kalender-Task).
- Zusätzlich wiederkehrend (z. B. quartalsweise): unbestätigte DOI-Kontakte und
  Alt-Daten abgemeldeter Kontakte in Brevo aufräumen.

═══════════════════════════════════════════════════════════════════════════════
✅ PUNKT 4 — MATOMO IP-KÜRZUNG: VERIFIZIERT (16.07.2026)
═══════════════════════════════════════════════════════════════════════════════

- DSE verspricht: „IP wird serverseitig sofort gekürzt (mind. 2 Bytes)".
- ERLEDIGT: In Matomo verifiziert, dass 2 Bytes gekürzt werden
  (Administration → Privacy → Anonymize Data). DSE-Aussage stimmt.

═══════════════════════════════════════════════════════════════════════════════
🟡 PUNKT 5 — APP-LOGS NICHT IN DER DSE ERWÄHNT
═══════════════════════════════════════════════════════════════════════════════

- `s-event.php:167` loggt die VOLLE IP, `submit.php` loggt E-MAIL-ADRESSEN
  (jeweils nur, wenn `log_file` in der Config gesetzt ist).
- Eigene App-Logs samt Speicherdauer stehen nirgends in der DSE (der
  Server-Log-Abschnitt deckt nur Hosting-Logs).
- **Fix:** Logs deaktiviert lassen, Log-Rotation/Löschfrist definieren, oder
  einen Satz in der DSE ergänzen.

═══════════════════════════════════════════════════════════════════════════════
✅ PUNKT 6 — LOCALSTORAGE JETZT IN DER DSE ERWÄHNT (16.07.2026, eigener
   Abschnitt „Speicherung Ihrer Datenschutz-Einstellungen (Local Storage)")
═══════════════════════════════════════════════════════════════════════════════

- Banner sagt „keine essenziellen Cookies" (stimmt), aber `cookie_consent_*`
  und `matomo_optout` liegen im localStorage — „ähnliche Technologien" i. S. d.
  § 25 TDDDG.
- Consent-Speicherung ist einwilligungsfrei (§ 25 Abs. 2, unbedingt
  erforderlich) — KEIN Verstoß, aber transparenzhalber erwähnenswert
  (DSE und/oder Banner-Kategorie „Essenziell").

═══════════════════════════════════════════════════════════════════════════════
✅ PUNKT 7 — WIDERRUF JETZT ÜBERALL MÖGLICH (16.07.2026: script.js öffnet das
   Banner bei #cookie-einstellungen; Links auf angebote.html + bestaetigt.html)
═══════════════════════════════════════════════════════════════════════════════

- DSE verweist auf „Cookie-Einstellungen im Fußbereich".
- `angebote.html` und `potenzialcheck/bestaetigt.html` haben WEDER Banner noch
  Revoke-Button, laden aber `script.js` (das bei früherer Zustimmung
  meetergo/Pixel aktiviert).
- Widerruf muss so leicht sein wie Erteilung (Art. 7 Abs. 3 DSGVO).
- **Fix:** Banner-/Footer-Markup auf diesen Seiten ergänzen (oder zumindest
  einen Link zu den Cookie-Einstellungen).

═══════════════════════════════════════════════════════════════════════════════
🟡 PUNKT 8 — NUR DU KANNST ES BESTÄTIGEN (CONTEXT.md Punkt 7)
═══════════════════════════════════════════════════════════════════════════════

- [x] AVV/DSV mit BREVO tatsächlich akzeptiert? (DSE behauptet: ja)
- [x] AVV mit ALL-INKL tatsächlich abgeschlossen? (DSE behauptet: ja; im
      KAS-Panel abschließbar)
- [x] Matomo-Server-Einstellungen (siehe Punkt 4)
- [x] Kein E-Mail-Listen-Upload zu Meta im Code (Lookalike-Seed nur über
      Pixel-Event) — konform mit CONTEXT.md

═══════════════════════════════════════════════════════════════════════════════
LAUNCH-/POST-DEPLOY-TESTPROTOKOLL: COOKIES & CONSENT (komplett)
═══════════════════════════════════════════════════════════════════════════════

Nach JEDEM Deploy durchgehen, der script.js, den Banner oder Tracking berührt
(~10 Minuten, DevTools). Immer im frischen privaten Fenster starten.

── Teil A: Matomo (Tests 1-5) ──────────────────────────────────────────────────

Zur Einordnung:
Der Opt-out-Check sitzt VOR jeder Initialisierung (`script.js:313`) — bei
`matomo_optout = 1` entsteht kein `window._paq`, kein matomo.js-Download, kein
Ping; auch Funnel-Events (check.js) und Cookie-Modus laufen dann ins Leere.

**Test 1 — Basis läuft cookielos (ohne Opt-out):**
- [ ] Privates Fenster → Seite öffnen → DevTools → Network, Filter: `decentnodes`
- [ ] Erwartung: `matomo.js` lädt + ein Request auf `matomo.php` (Zähl-Ping)
- [ ] Application → Cookies: KEIN `_pk_*`-Cookie vorhanden (beweist cookieless)
- [ ] ⚠️ Falle: „Do Not Track" im Browser vorher AUSSCHALTEN — der Code
      respektiert DNT; mit aktivem DNT gibt es auch ohne Opt-out keinen Ping.

**Test 2 — Opt-out:**
- [ ] Auf datenschutz.html den Haken entfernen → Application → Local Storage:
      `matomo_optout = 1` erscheint
- [ ] Beliebige Seite NEU LADEN → Network: NULL Requests an
      analytics.decentnodes.de (weder matomo.js noch matomo.php).
      Konsole: „[consent] Matomo-Opt-out aktiv — keine Messung."
- [ ] Haken wieder setzen → Reload → Requests kommen zurück

**Test 3 — Cookie-Modus (Banner):**
- [ ] Im Banner „Statistik" zustimmen → Reload → jetzt DÜRFEN
      `_pk_id`/`_pk_ses`-Cookies da sein
- [ ] Widerrufen → Cookies verschwinden, matomo.php-Pings laufen cookielos weiter

**Test 4 — Gegenprobe im Matomo-Backend:**
- [ ] Matomo → Besucher → „Besuche in Echtzeit" offen halten.
      Mit Opt-out: du tauchst beim Surfen NICHT auf.
      Ohne Opt-out: du erscheinst als anonymisierter Besucher — dort auch die
      gekürzte IP sichtbar (Doppelkontrolle der 2-Byte-Einstellung).

**Test 5 — www/non-www (der einzige echte Risiko-Randfall):**
- [ ] `https://smartwandler.de` (ohne www) aufrufen → MUSS auf
      `https://www.smartwandler.de` umleiten (oder umgekehrt).
      Grund: localStorage ist origin-gebunden — ohne Redirect gelten Opt-out
      und JEDE Consent-Wahl nur auf einer der beiden Varianten.
      Falls kein Redirect: im all-inkl KAS Weiterleitung einrichten.

**Bekannte, akzeptable Randfälle (kein Fix nötig):**
- Auf der Datenschutzseite selbst ist der laufende Seitenaufruf beim Klick aufs
  Opt-out bereits gezählt; Wirkung greift ab dem nächsten Seitenload
  (Opt-out wirkt für die Zukunft — rechtlich okay, im Code kommentiert).
- Opt-out gilt pro Browser/Gerät (localStorage) — normal und unvermeidbar.

── Teil B: Meta-Pixel + Conversions API (Tests 6-7) ────────────────────────────

**Test 6 — Pixel lädt NUR nach Einwilligung:**
- [ ] Frisches privates Fenster → Network-Filter: `facebook` →
      VOR jeder Banner-Entscheidung und nach „Ablehnen": KEIN Request an
      connect.facebook.net, KEINE Cookies `_fbp`/`_fbc`
- [ ] Banner → „Marketing" aktivieren → `fbevents.js` lädt, PageView feuert,
      `_fbp`-Cookie erscheint (Application → Cookies)
- [ ] Widerruf über Cookie-Einstellungen → Seite lädt neu, `_fbp`/`_fbc`
      sind GELÖSCHT, keine facebook-Requests mehr

**Test 7 — Conversions API nur mit Consent:**
- [ ] OHNE Marketing-Consent: Potenzial-Check komplett durchklicken →
      Network: KEIN Request an `s-event.php`
- [ ] MIT Marketing-Consent: Check abschließen → `s-event.php`-Request
      erscheint (Status 204); dito auf termin-gebucht.html
- [ ] Meta Events Manager: Events kommen als Browser + Server an und werden
      dedupliziert (gleiche event_id)

── Teil C: meetergo + Banner-Verhalten (Tests 8-10) ────────────────────────────

**Test 8 — meetergo lädt NUR nach Einwilligung:**
- [ ] Network-Filter: `amazonaws` → vor Entscheidung / nach „Ablehnen":
      KEIN Request auf `browser-v4.js` (S3), KEIN Sidebar-Button sichtbar
- [ ] „Funktional" aktivieren → SDK lädt, Sidebar-Button erscheint
- [ ] Widerruf → nach Reload kein SDK, kein Button

**Test 9 — „Ablehnen"-Button:**
- [ ] „Ablehnen" klicken → localStorage zeigt alle drei
      `cookie_consent_*` = denied → Reload → nur Matomo-Basis-Ping
      (cookielos), sonst KEINE externen Requests

**Test 10 — Widerrufs-Zugang von Seiten ohne Banner:**
- [ ] `angebote.html` → Footer „Cookie-Einstellungen" → landet auf
      index.html und das Banner ÖFFNET sich (Hash #cookie-einstellungen)
- [ ] `potenzialcheck/bestaetigt.html` → gleicher Test über den Link unten

═══════════════════════════════════════════════════════════════════════════════
EMPFOHLENE REIHENFOLGE
═══════════════════════════════════════════════════════════════════════════════

1. Punkt 1 (DSE-Satz zu Brevo korrigieren) — reine Textänderung, vor Launch
2. Punkt 3 (Lösch-Cron/Task einrichten)
3. Punkt 2 (meetergo-Rechtsgrundlage in DSE anpassen)
4. Punkt 4 (Matomo-Einstellungen verifizieren, passt zu stand.md)
5. Punkte 5-7 (Kür, aber günstig zu haben)

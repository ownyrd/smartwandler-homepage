# Potenzial-Check — Backend-Setup (Epic 2)

Runbook zum Hochladen auf all-inkl und Testen. Reihenfolge einhalten.

## Dateien im Ordner `/potenzialcheck/`

| Datei | Zweck | Ins Git? |
|---|---|---|
| `index.html`, `check.css`, `check.js` | Check-Frontend (Epic 1) | ✅ |
| `schema.sql` | DB-Tabelle `leads` (2.1) | ✅ |
| `submit.php` | Backend-Endpoint (2.5) | ✅ |
| `submit-config.php.example` | Config-Vorlage | ✅ |
| **`submit-config.php`** | **echte Zugangsdaten** | ❌ (`.gitignore`) |
| `bestaetigt.html` | DOI-Redirect-Ziel (2.6) | ✅ |
| `report-template.brevo.html` | Report-Mail-Vorlage für Brevo (2.4) | ✅ |
| `doi-template.brevo.html` | DOI-Bestätigungs-Vorlage für Brevo (2.6) | ✅ |
| `cleanup-leads.php` | Lösch-Cron, DSGVO-Löschkonzept (2.8) | ✅ |
| `datenschutz-audit.md` | DSGVO-Audit + Launch-Testprotokoll | ✅ |
| `Report-Mail-Konzept.md` | Konzept hinter der Report-Mail | ✅ |
| `meta-ads-creatives.md`, `meta-ads-image-prompts.md`, `meta-creatives/` | Meta-Ads-Material (Epic 5) — **nicht** Teil des Website-Deploys | ✅ |

---

## 2.1 — MySQL-Tabelle anlegen

1. all-inkl KAS → phpMyAdmin öffnen, Datenbank auswählen (oder neu anlegen).
2. Reiter **SQL** → Inhalt von `schema.sql` einfügen → **OK**.
3. Tabelle `leads` erscheint links.

## 2.2 — Brevo: Domain verifizieren (SPF/DKIM/DMARC) `[R]`

Ohne das landen Mails im Spam oder werden abgelehnt.

1. Brevo → **Settings → Senders, Domains & Dedicated IPs → Domains**.
2. `smartwandler.de` hinzufügen → Brevo zeigt DNS-Records (Brevo-Code, DKIM, SPF).
3. Diese Records im all-inkl DNS (KAS → Domain → DNS-Einstellungen) anlegen:
   1. Brevo sagt welche Einträge gemacht werden müssen
   - **Brevo-Code** (TXT zur Domain-Bestätigung) ohne @, einfach leer lassen den Key
   - **DMARC** (TXT `_dmarc`: z. B. `v=DMARC1; p=none; rua=mailto:dmarc@smartwandler.de`) --> muss ergänzt werden der vorhandene
4. In Brevo auf **Verify / Authenticate** klicken (DNS-Propagation kann Stunden dauern).
5. Absender `info@smartwandler.de` muss als **verified sender** grün sein.

## 2.3 — Config serverseitig (C1)

1. `submit-config.php.example` → Kopie **`submit-config.php`**.
2. Werte eintragen:
   - **DB**: `db_host` (all-inkl meist `localhost`), `db_name`, `db_user`, `db_pass`.
   - **Brevo**: `brevo_api_key` (Brevo → Settings → SMTP & API → **API Keys**).
   - `sender_email` = deine in 2.2 verifizierte Adresse.
   - **Demo-Video im Report** (optional): `video_url` / `video_poster` — Default
     zeigt auf `…/video/smartwandler-demo-720p.mp4` bzw. `…-poster.jpg`.
     Leer (`''`) = Video-Block wird in der Report-Mail ausgeblendet.
   - **Lösch-Cron**: `cleanup_token` = langer Zufallswert
     (z. B. `openssl rand -hex 32`), siehe 2.8. Leer = Cron-Endpoint deaktiviert.
3. `submit-config.php` per FTP in `/potenzialcheck/` legen — **nie** ins Git.
   Der API-Key steht nur hier, niemals im Client-JS.

## 2.4 — Report-Template

Zwei Betriebsarten, gesteuert über `brevo_report_template_id`:

**A) `= 0` (Standard):** `submit.php` baut das Report-HTML selbst. Funktioniert
sofort, kein Template in Brevo nötig.

**B) `= <ID>` (empfohlen, branchen-/aufgabenspezifisch):** EIN Brevo-Template
mit Bedingungen, `submit.php` liefert nur die Werte.

1. Brevo → **Templates → New template**, Name „Potenzialcheck Report".
2. Absender = verifizierte Adresse. Betreff z. B.
   `Ihr Potenzial: {{ params.MIN }} bis {{ params.MAX }} €, und wie ein Betrieb wie Ihrer das schon macht`.
3. Editor → **„Code your own"** → kompletten Inhalt von
   **`report-template.brevo.html`** einfügen → speichern & **aktivieren**.
4. Template-ID (aus URL/Übersicht) in `submit-config.php`:
   `'brevo_report_template_id' => 42,`

Aufbau der Report-Mail (siehe `Report-Mail-Konzept.md`): Header mit Logo ·
€-Spanne · Einordnung · **Praxisfall je Branche** · Branchen-Abschnitt ·
Zeitfresser (mit Einstiegs-Beispiel + Aufwand) · „So läuft so ein Projekt ab" ·
Datensicherheits-Block (nur bei Bedarf) · Demo-Video (ein Poster-Link) ·
eine CTA · „Ihr Ansprechpartner". Durchgängig Sie-Form, keine Gedankenstriche.

⚠️ Damit Logo + Video-Poster in der Mail laden, müssen
`images/logo-small.png` sowie `video/smartwandler-demo-poster.jpg` und
`…-720p.mp4` auf `www.smartwandler.de` deployed sein.

Verfügbare Params:
- **Text:** `NAME`, `MIN`, `MAX`, `HEADLINE`, `BODY`, `BRANCHE`, `BRANCHE_KEY`,
  `MITARBEITER`, `ROLLE`, `STUNDEN`, `ZUFRIEDENHEIT`, `DRINGLICHKEIT`,
  `ZEITFRESSER` (Komma-Liste), `MEETERGO` (Link),
  `VIDEO_URL`, `VIDEO_POSTER` (leer = Video-Block aus).
- **Schalter je Aufgabe:** `ZF_ANGEBOTE`, `ZF_DATEN`, `ZF_EMAILS`, `ZF_DOKUMENTE`,
  `ZF_KOORDINATION`, `ZF_BERICHTE`.
- **Schalter Routing:** `SHOW_DSGVO` (Datensicherheits-Block; true bei Branche
  Gesundheit/Kanzlei oder Zufriedenheit „Cloud-Bedenken").

Bedingungen im Template:
```
{% if params.ZF_ANGEBOTE %} …Tipp zu Angeboten… {% endif %}
{% if params.BRANCHE_KEY == "kanzlei" %} …Kanzlei-Text… {% endif %}
```
Texte frei in Brevo anpassbar, die `{% … %}`-Blöcke stehen lassen. Sowohl
Branchen- als auch Aufgaben-Texte sind in `report-template.brevo.html` schon
ausformuliert vorbelegt.

## 2.5 — submit.php

Liegt bereit. Ablauf pro Absenden aus dem Mail-Gate:
1. Insert in `leads` (C5).
2. Report-Mail via Brevo Transactional — **immer** (angeforderter Dienst).
3. **Nur bei angehaktem Consent** + konfigurierter DOI (siehe 2.6): Brevo
   Double-Opt-In (Kontakt + Bestätigungsmail).

Antwort `{"ok":true}`, sobald die Report-Mail akzeptiert wurde.

## 2.6 — Nurture-DOI-Liste + Bestätigung `[R]`

Nur nötig, damit der **Consent-Pfad** (freiwillige Checkbox) wirkt. Solange die
IDs `0` sind, wird er übersprungen — Report-Mail geht trotzdem raus.

1. Brevo → **Contacts → Lists** → Liste anlegen (z. B. „Potenzialcheck Nurture")
   → **List-ID** merken → in `brevo_list_id`.
2. Brevo → **Marketing → Templates → Double opt-in** Template anlegen →
   Inhalt aus **`doi-template.brevo.html`** einfügen (enthält Logo, die zwei
   Vorteils-Bullets „monatlicher Automatisierungs-Fall + kostenloser
   Anwendungsfall-Call" und den `{{ doubleoptin }}`-Bestätigungslink — Namen
   nicht ändern) → **Template-ID** → in `brevo_doi_template_id`.
3. `doi_redirect_url` zeigt auf `…/potenzialcheck/bestaetigt.html` (liegt bei).
4. Optional (Antworten als Kontakt-Attribute): in Brevo → **Contacts → Settings →
   Contact Attributes** die Attribute anlegen: `VORNAME`, `BRANCHE`, `ROLLE`,
   `SW_MITARBEITER`, `SW_ROUTINESTUNDEN_PRO_MA`, `SW_ZUFRIEDENHEIT`,
   `SW_DRINGLICHKEIT` (Typ **Text**) sowie `SW_POTENZIAL_MIN`, `SW_POTENZIAL_MAX`
   (Typ **Zahl**). Danach `contact_attributes_enabled => true`.
   ⚠️ Erst anlegen, dann aktivieren — sonst lehnt Brevo den DOI-Call ab.

## 2.7 — End-to-End-Test

1. Zum Testen zeitweise in `submit-config.php` `'log_file' => __DIR__ . '/submit.log'` setzen.
2. `https://www.smartwandler.de/potenzialcheck/` öffnen, Check durchklicken.
3. Auf der Ergebnisseite E-Mail eintragen, **ohne** Haken → „Report anfordern".
   - Erwartung: Erfolgs-Screen, Report-Mail kommt an, neue Zeile in `leads` (`consent=0`).
4. Zweiter Durchlauf **mit** Haken (wenn 2.6 fertig):
   - Erwartung: zusätzlich DOI-Bestätigungsmail; nach Klick Redirect auf `bestaetigt.html`,
     Kontakt landet in der Liste.
5. `submit.log` prüfen: `report … status=201`, ggf. `doi … status=20x`.
   Danach `log_file` wieder leeren/entfernen.

### Häufige Stolpersteine
- **Report kommt nicht:** Absender in 2.2 nicht verifiziert, oder falscher API-Key → `submit.log` / Brevo → Transactional → Logs prüfen.
- **DOI-Call 400 „attribute does not exist":** Attribute in Brevo fehlen → `contact_attributes_enabled` auf `false` oder Attribute anlegen (2.6.4).
- **403 vom Endpoint:** Aufruf kam nicht von `smartwandler.de` → `allowed_hosts` in der Config prüfen.
- **Bilder in der Mail fehlen:** Logo/Poster noch nicht deployed (siehe 2.4) —
  oder der Mail-Client blockt Remote-Content (normal; „Inhalte laden" klicken).
- ⚠️ **Datenschutz:** `log_file` nur zum Testen setzen (loggt E-Mail-Adressen)
  und danach wieder entfernen — App-Logs sind nicht in der DSE beschrieben.

## 2.8 — Lösch-Cron (DSGVO-Löschkonzept)

Die Datenschutzerklärung verspricht Löschung nicht-konvertierter Leads
**spätestens nach 24 Monaten**. `cleanup-leads.php` setzt das um
(Default: Newsletter-bestätigte Leads mit `confirmed_at` bleiben erhalten).

1. In `submit-config.php` eintragen: `'cleanup_token' => '<64 Zufallszeichen>'`
   (erzeugen mit `openssl rand -hex 32`). Ohne Token verweigert das Skript alles.
2. all-inkl **KAS → Tools → Cronjobs** → neuen Cronjob anlegen, z. B. monatlich:
   `https://www.smartwandler.de/potenzialcheck/cleanup-leads.php?token=<WERT>`
3. Testen: Aufruf mit falschem Token → `403`. Mit richtigem Token →
   `{"ok":true,"deleted":N}`.
4. **Zusätzlich als Kalender-Task (quartalsweise, manuell in Brevo):**
   unbestätigte DOI-Kontakte (~30 Tage alt) löschen und Alt-Daten abgemeldeter
   Kontakte bereinigen. Details: `datenschutz-audit.md` Punkt 3.

## 2.9 — Deploy-Checkliste Website (Änderungen vom 14.–16.07.2026)

Beim nächsten FTP-Upload müssen zusätzlich zu `/potenzialcheck/` diese
geänderten Dateien im **Root** mit hoch:

- `datenschutz.html` — korrigierte Brevo-Passage, meetergo-Rechtsgrundlage,
  neuer Local-Storage-Abschnitt
- `script.js` — Banner öffnet sich bei `index.html#cookie-einstellungen`
  (Widerrufs-Zugang für Seiten ohne Banner)
- `angebote.html` — „Cookie-Einstellungen"-Link im Footer
- `video/smartwandler-demo-720p.mp4` + `…-poster.jpg` — für den Video-Block
  im Report (Ordner `/video/` komplett)

Nach dem Deploy:
- [ ] Cookie-/Consent-Testprotokoll KOMPLETT durchgehen (`datenschutz-audit.md`,
      Abschnitt „Launch-/Post-Deploy-Testprotokoll", Tests 1–10: Matomo,
      Pixel/CAPI, meetergo, Ablehnen, Widerruf) — inkl. www/non-www-Redirect
- [ ] `…/potenzialcheck/bestaetigt.html` aufrufen: Link „Cookie-Einstellungen"
      öffnet das Banner auf der Startseite
- [ ] Brevo-Testversand des Reports an eigene Adresse (Logo + Poster laden?)

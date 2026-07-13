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
3. `submit-config.php` per FTP in `/potenzialcheck/` legen — **nie** ins Git.
   Der API-Key steht nur hier, niemals im Client-JS.

## 2.4 — Report-Template

Standard: `brevo_report_template_id = 0` → `submit.php` baut das Report-HTML
selbst (Marken-Layout, €-Spanne, Zeitfresser, Routing-Text, meetergo-Button).
**Es ist kein Template in Brevo nötig, um zu testen.**

Optional später: in Brevo ein Transactional-Template bauen und dessen ID in
`brevo_report_template_id` eintragen. Verfügbare Params: `{{params.NAME}}`,
`{{params.MIN}}`, `{{params.MAX}}`, `{{params.HEADLINE}}`, `{{params.BODY}}`,
`{{params.ZEITFRESSER}}`.

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
2. Brevo → **Campaigns → Templates → Double opt-in** Template anlegen (mit dem
   Platzhalter-Bestätigungslink) → **Template-ID** → in `brevo_doi_template_id`.
3. `doi_redirect_url` zeigt auf `…/potenzialcheck/bestaetigt.html` (liegt bei).
4. Optional (Antworten als Kontakt-Attribute): in Brevo → **Contacts → Settings →
   Contact Attributes** die Attribute anlegen: `VORNAME`, `BRANCHE`, `MITARBEITER`,
   `ROLLE`, `STUNDEN`, `ZUFRIEDENHEIT`, `DRINGLICHKEIT` (Text) sowie
   `POTENZIAL_MIN`, `POTENZIAL_MAX` (Zahl). Danach `contact_attributes_enabled => true`.
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

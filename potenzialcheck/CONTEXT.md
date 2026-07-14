# smartwandler — Lead-Funnel: Projektkontext für Claude Code

> Diese Datei ist der vollständige Kontext für die Umsetzung. Sie enthält alle
> getroffenen Entscheidungen. Die `CONSTRAINTS` unten sind **nicht verhandelbar** —
> bitte nicht "wegoptimieren".

---

## 1. Projekt in 3 Sätzen

Ein interaktiver **Potenzial-Check** (Web-Tool) ist der zentrale Lead-Magnet für smartwandler
(Digitalisierung/Automatisierung/KI für KMU). Funnel: **Meta Ad → Check → Sofort-Ergebnis + Call-Button
→ Report per Mail → Nurture → Erstgespräch**, später Retargeting & Lookalike. Zielgruppe: **KMU 5–20
Mitarbeiter, Region Sachsen/Dresden**, Entscheider.

Der Check macht **doppelte Arbeit**: er *qualifiziert* (falsche Leute fallen raus) und *übersetzt*
(der GF sieht seinen Alltag in Alltagssprache gespiegelt — bewusst KEINE Technik-Begriffe).

---

## 2. Tech-Stack (vorhanden)

- **Hosting:** all-inkl, PHP + MySQL (phpMyAdmin)
- **Frontend:** HTML + Vanilla JS (kein Framework, mobile-first, schnelle Ladezeit — Ad-Landingpage)
- **E-Mail:** Brevo (Free-Plan; voller API-Zugang inkl. Transactional + Contacts; 300 Mails/Tag; Automation-Reichweite im Free-Tier vor Bau prüfen)
- **Analytics:** Matomo (self-hosted auf all-inkl)
- **Ads-Tracking:** Meta-Pixel
- **Termine:** meetergo (Erstgespräch-Kalender, existiert bereits)

---

## 3. Architektur & Datenfluss

```
Meta Ad → Check-Seite (HTML/JS)
  → 7 Fragen (Antworten im Browser)
  → JS rechnet ERSTES Ergebnis (€-Spanne) und zeigt es SOFORT + meetergo-Call-Button
  → Mail-Gate darunter: "Detaillierten Report per Mail" (E-Mail + Name + freiwillige Checkbox)
  → JS POST {antworten, mail, name, consent} an submit.php
        submit.php:
          (a) INSERT in MySQL
          (b) Brevo Transactional-API → Report-Mail (IMMER, angeforderter Dienst)
          (c) NUR bei consent=true → Brevo Contacts-API → Kontakt + Antworten als Attribute → DOI-Liste
  → JS feuert: Matomo-Events (jeder Schritt) + Pixel Lead / QualifiedLead
Brevo autonom: DOI-Bestätigung → nach Klick Nurture-Automation → Abmeldung
```

**Zwei-Ebenen-Ergebnis (bewusst so):** Die *Spitze* (grobe €-Spanne + Call-Button) ist sofort auf der
Seite sichtbar — das ist der stärkste Conversion-Moment und braucht KEINE Einwilligung. Die *Tiefe*
(detaillierter Report: welche Aufgaben automatisierbar, grobe Dauer, Lösungsweg) kommt per Mail →
Grund, die Adresse zu geben.

---

## 4. Die 7 Check-Fragen (final)

1. **Branche?** Handwerk/Bau · Handel/E-Commerce · Dienstleistung/Beratung · Produktion/Fertigung · Gesundheit/Pflege/Kanzlei · Sonstige
2. **Mitarbeiterzahl?** **1–4** · **5–20** · 21–50 · über 50   *(1–4 oder 5–20 = Teil des Seed-Kriteriums)*
3. **Deine Rolle?** **Inhaber:in/Geschäftsführung** · **Geschäftsleitung/Prokura** · IT-/Projektverantwortlich · Mitarbeiter:in ohne Budgetentscheidung   *(Inhaber/GF oder GL/Prokura = zweite Hälfte des Seed-Kriteriums)*
4. **Wo verliert dein Team am meisten Zeit mit wiederkehrender Arbeit?** *(Mehrfachauswahl)* Angebote/Rechnungen schreiben · Daten doppelt eintippen · E-Mails sortieren & beantworten · Dokumente suchen & ablegen · Termine/Aufträge/Einsätze koordinieren · Berichte/Protokolle/Doku erstellen
5. **Wie viele Stunden/Woche verschlingen solche Routineaufgaben grob?** Unter 5 · 5–10 · 10–20 · über 20 · weiß ich nicht genau
6. **Wie zufrieden bist du mit der heutigen Lösung?** Läuft, aber Software zu teuer/passt nicht · Läuft, aber Daten in Clouds, bei denen ich kein gutes Gefühl habe · Nein, vieles läuft manuell · Bin unsicher, was geht
7. **Wie schnell willst du das angehen?** So schnell wie möglich · In den nächsten Monaten · Erstmal nur informieren

---

## 5. Ergebnis-Logik

**€-Berechnung (client-side, aus Frage 5):**
`Stundenmittel × 0,40 (automatisierbar) × 45 Wochen × 35 €/h`
Stundenmittel je Bucket: <5 → 3 · 5–10 → 7,5 · 10–20 → 15 · >20 → 25 · "weiß nicht" → 10 (Annahme).
**Immer als SPANNE ausgeben** (z. B. Ergebnis ±25 %), nie als Scheinpräzision. Beispiel-Text:
„Grobe Schätzung: 6.000–11.000 €/Jahr, die aktuell in Routinearbeit gebunden sind."

**Routing (Ergebnis-Text + Call-Button-Personalisierung, aus Frage 1 + 6):**
- Frage 6 = „Daten in Clouds / kein gutes Gefühl" ODER Branche sensibel (Gesundheit/Kanzlei)
  → **beide** Wege betonen: EU-Cloud (DSGVO-konform) *oder* On-Premise vor Ort, „was passt, klären wir im Gespräch".
- Frage 6 = „Software zu teuer" → **Festpreis-Vorteil** betonen.
- Wichtig: On-Premise/Cloud/DSGVO ist der Differenzierer IM ERGEBNIS/Gespräch — **nicht** der Ad-Hook.

---

## 6. CONSTRAINTS (nicht verhandelbar)

- **C1 — Brevo-API-Key nur serverseitig** (in `submit.php`), NIEMALS im Client-JS.
- **C2 — Consent-Trennung:** Report-Mail = transaktional (immer erlaubt). Nurture = Marketing (nur mit separater, **nicht vorangekreuzter, freiwilliger** Checkbox + Double-Opt-In). Checkbox ist **kein Pflichtfeld** (Kopplungsverbot Art. 7 Abs. 4 DSGVO — erzwungene Einwilligung ist ungültig).
- **C3 — Matomo cookieless als Basis:** `disableCookies()` + IP-Anonymisierung (≥2 Bytes). Läuft consent-frei bei ALLEN → das ist die *ehrliche* Funnel-Wahrheit. Optionaler Hybrid-Upgrade auf Cookie-Modus (`setConsentGiven()`) nur bei Banner-Zustimmung.
- **C4 — Meta-Pixel nur für Meta:** `Lead` bei jedem Check-Abschluss; Custom-Event **`QualifiedLead` NUR wenn Frage 2 = „1–4" ODER „5–20" UND Frage 3 = „Inhaber/GF" ODER „Geschäftsleitung/Prokura"** (= Lookalike-Seed: Entscheider kleiner Betriebe). **Kein PII** in Event-Parametern. Pixel feuert nur bei akzeptiertem Cookie.
- **C5 — MySQL ist eigene Wahrheit + Seed-Filter.** Behalten, auch wenn Brevo speichert (getrennte Rechtsgrundlage, siehe Recht).
- **C6 — Sofort-Ergebnis nicht hinter die Mail verstecken.** Spitze immer sichtbar, damit der Call-Button den heißesten Moment erwischt.
- **C7 — Alltagssprache im Check & in der Ad.** Köder = Schmerzpunkt („3 h/Woche Angebote schreiben"), nicht Technik.

---

## 7. Rechtliche Must-dos (vom DSB/Fachanwalt absegnen lassen)

- **AV-Vertrag mit Brevo** aktivieren.
- **Rechtsgrundlagen** (in Datenschutzerklärung benennen): Mail + „Report anfordern" = Vertrag/vorvertraglich (Art. 6 I b); Check-Antworten = berechtigtes Interesse (Art. 6 I f); Nurture = Einwilligung + DOI.
- **Datenschutzerklärung** erweitern: Check-Speicherung, MySQL, Brevo (Auftragsverarbeiter), Matomo (cookieless + Cookie-Modus), Meta-Pixel.
- **Löschkonzept:** nicht-konvertierte Leads nach 12–24 Monaten löschen (`created_at`-basiert).
- **Cookie-Banner:** Matomo-Cookie-Modus + Meta-Pixel als abwählbare Optionen; cookielose Matomo-Basis NICHT im Banner.
- Für den späteren Lookalike: **kein E-Mail-Listen-Upload zu Meta** (einwilligungspflichtig, VG Bayreuth 2018). Seed kommt aus dem Pixel-Event `QualifiedLead`, nicht aus der Mailliste.

---

## 8. DB-Schema (Startpunkt)

```sql
CREATE TABLE leads (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  branche       VARCHAR(50),
  mitarbeiter   VARCHAR(20),
  rolle         VARCHAR(50),
  zeitfresser   TEXT,            -- Mehrfachauswahl, z.B. JSON/CSV
  stunden       VARCHAR(20),
  zufriedenheit VARCHAR(80),
  dringlichkeit VARCHAR(40),
  ergebnis_min  INT,             -- berechnete €-Spanne (unten)
  ergebnis_max  INT,             -- berechnete €-Spanne (oben)
  email         VARCHAR(255),
  name          VARCHAR(120),
  consent       TINYINT(1) DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at  DATETIME NULL
);
```

---

## 9. Backlog (abhakbar, in Reihenfolge)

Legende: `[*]` kritischer Pfad · `[R]` rechtlich.
**Kritischer Pfad:** Epic 1 (Check) + Epic 2 (Backend) müssen stehen, bevor Ads (Epic 5) Sinn ergeben.

### Epic 1 — Check-Frontend `[*]`
- [x] 1.1 Check-Seite HTML/JS (7 Fragen, Fortschritt, mobil, schnell)
- [x] 1.2 €-Rechnung client-side (Abschnitt 5), Ausgabe als Spanne
- [x] 1.3 Ergebnis-Routing On-Premise/EU-Cloud/Festpreis (Abschnitt 5)
- [x] 1.4 Ergebnisseite: Spitze sofort sichtbar + meetergo-Call-Button
- [x] 1.5 Mail-Gate: E-Mail + Name + freiwillige, nicht vorangekreuzte Checkbox `[R]`

### Epic 2 — Backend `[*]`
- [x] 2.1 MySQL-Tabelle (Abschnitt 8)
- [x] 2.2 Brevo: Domain verifizieren (SPF/DKIM/DMARC) `[R]`
- [x] 2.3 Brevo-API-Key serverseitig `[*]` (C1)
- [x] 2.4 Brevo Transactional-Template (Report/„Tiefe")
- [x] 2.5 submit.php: Insert + Transactional + (bei consent) Contacts→DOI `[*]`
- [x] 2.6 Brevo DOI-Liste + Bestätigung `[R]`
- [x] 2.7 End-to-End-Test

### Epic 3 — Tracking
- [x] 3.1 Matomo cookieless + IP-Anonymisierung `[R]` (C3)
- [x] 3.2 Matomo Funnel-Events pro Schritt
- [x] 3.3 Matomo Hybrid-Upgrade bei Consent `[R]`
- [x] 3.4 Meta-Pixel einbauen `[*]`
- [x] 3.5 Events Lead + QualifiedLead (bedingt, C4) `[*]`
- [x] 3.6 Cookie-Banner: Matomo-Cookie + Pixel abwählbar `[R]`
- [x] 3.7 Test im Meta Events Manager

### Epic 4 — Nurture
- [ ] 4.1 4–5 Nurture-Mails (Praxisfall / DSGVO On-Prem+EU-Cloud / Kosten-Einwand / Einladung)
- [ ] 4.2 Brevo-Automation (Free-Reichweite prüfen)
- [ ] 4.3 Optional: Verzweigung nach Attribut

### Epic 5 — Meta Ads Setup `[*]`
- [ ] 5.1 Business Manager + Werbekonto (keine „Beitrag bewerben")
- [ ] 5.2 Pixel mit Konto verbinden, im Events Manager verifizieren `[*]`
- [ ] 5.3 Standort Dresden/Sachsen → „Personen, die hier wohnen"
- [ ] 5.4 Fan-Kreis + deren Freunde AUSSCHLIESSEN `[*]`
- [ ] 5.5 Advantage+/Zielgruppenerweiterung AUS `[*]`
- [ ] 5.6 Ziel: Leads/Conversions auf Check-Abschluss (nicht Reichweite) `[*]`
- [ ] 5.7 4–5 statische Hook-Varianten (Schmerzpunkt-Köder)
- [ ] 5.8 Kampagne, ~350 €/Monat kalt

### Epic 6 — Launch & Lernphase (Monat 1)
- [ ] 6.1 Soft-Launch, erste Tage beobachten
- [ ] 6.2 Kontrolle: Fremde statt Freunde? sonst 5.4/5.5 schärfen
- [ ] 6.3 Mess-Schichten: Klick→Start→Abschluss→Buchung→Relevanz
- [ ] 6.4 Schwache Hooks pausieren
- [ ] 6.5 Erste Gespräche einordnen (richtige Leute? verstehen sie's?)

### Epic 7 — Retargeting (ab ~Woche 3–4)
- [ ] 7.1 Website Custom Audience aus Check-Besuchern (14–30 Tage)
- [ ] 7.2 Warten bis ~100 im Pool
- [ ] 7.3 Retargeting-Kampagne ~150 €/Monat
- [ ] 7.4 Budget-Split 350/150 final

### Epic 8 — Skalierung (nach ~100 QualifiedLead)
- [ ] 8.1 Lookalike aus QualifiedLead-Seed (Pixel, kein Listen-Upload) `[R]`
- [ ] 8.2 Lookalike bundesweit ausspielen
- [ ] 8.3 Gewinner-Hook als kurzes Video (15–20 s, Hook in Sek. 1)
- [ ] 8.4 Optional: warme Kanäle (LinkedIn, IHK Dresden, Empfehlungen) auf dieselbe Check-URL

---

## 10. Realistische Erwartung

1–4 relevante Erstgespräche/Monat bei 500 € Budget; Monat 1 ist v. a. Metas Lernphase + Seed-Aufbau
(quasi Nullrunde). Der Check ist der zentrale Baustein — er funktioniert später auch mit LinkedIn/IHK,
unabhängig von Meta. Bisheriges Problem war „falsche Zielgruppe + Angebot nicht verstanden" → der Check
löst beides (Filter + Übersetzung).

*Hinweis: kein Rechtsrat. `[R]`-Punkte fachlich absegnen lassen.*

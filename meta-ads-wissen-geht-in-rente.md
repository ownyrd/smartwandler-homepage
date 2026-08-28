# Meta Ads: „Damit Erfahrung nicht in Rente geht“

Kampagnenkonzept zur Landing Page `wissen-geht-in-rente.html`.
Basis: Ideensammlung in `wissen-geht-in-rente.md`, Tracking-Setup wie in `PROCESS.md`.

---

## 1. Positionierung, die in den Anzeigen trägt

| Ebene | Satz | Wo eingesetzt |
|---|---|---|
| Emotionaler Kampagnen-Claim | **Damit Erfahrung nicht in Rente geht.** | Anzeigen, Hooks, Bildtext |
| Problem | Endlich wissen, wo alles steht. | Anzeigen für den „Ablage-Schmerz“ |
| Positionierung | KI beginnt mit guten Daten. | Abgrenzungs-/Provokations-Winkel |
| Nutzen | Ihr Wissen. Endlich nutzbar. | Retargeting, Abbinder |

Regel für alle Texte: **erst der Schmerz in ihrer Sprache, dann KI**. „KI“ nie in der ersten Zeile. Wer „KI-Beratung“ liest, scrollt weiter; wer „der Kollege geht Ende des Jahres“ liest, bleibt hängen.

---

## 2. Kampagnenstruktur

**Ziel:** Leads (Conversion) auf `meeting_scheduled` (Server + Browser, dedupliziert über `termin-gebucht.html` — siehe PROCESS.md).
Solange < 20–30 Conversions/Woche zusammenkommen, ist die Kampagne im Lernmodus. Dann alternativ auf `ViewContent`/Landingpage-View optimieren und Termine manuell gegenrechnen.

```
Kampagne: SW | Leads | Wissenstransfer | 2026
├── Ad-Set A — Broad DE (Advantage+ Zielgruppe, nur Alter/Geo)
├── Ad-Set B — Interessen & Arbeitgeber-Signale
├── Ad-Set C — Retargeting (Website 180 T., Video 25 %, Interaktion 365 T.)
└── (später) Ad-Set D — Lookalike 1 % auf Terminbucher
```

- **Platzierungen:** Advantage+ Placements. Feed und Reels bekommen ohnehin den Löwenanteil; Creative in 4:5 **und** 9:16 liefern.
- **Budget-Empfehlung Start:** 25–40 €/Tag gesamt, davon ~60 % A, ~25 % B, ~15 % C. Erst skalieren, wenn ein Creative stabil Termine bringt.
- **Laufzeit bis zur ersten Bewertung:** 10–14 Tage, nicht früher abschalten. Bei diesem Angebot ist der Klick billig und der Termin selten — kurzfristige CPL-Ausschläge sagen nichts.

### Zielgruppen im Detail

**A — Broad (der wichtigste Test).** Alter 35–65+, Deutschland (oder 100-km-Radius um Ihre Region, wenn Vor-Ort-Termine gewollt sind). Keine Interessen. Das Creative übernimmt das Targeting: Wer „Anlagenbau“, „Instandhaltung“, „Betriebsleiter“ liest, meldet sich, alle anderen scrollen weiter.

**B — Interessen & Signale.** Kombinierbar, aber nicht zu eng stapeln:
- Unternehmensnachfolge, Familienunternehmen, Mittelstand, IHK / Handwerkskammer
- Fachmedien: Produktion, VDI, MM Maschinenmarkt, Handwerk Magazin, Instandhaltung
- Berufsbezeichnungen: Geschäftsführer, Inhaber, Betriebsleiter, Produktionsleiter, Technischer Leiter, Werkstattleiter, QM-Leiter
- Arbeitgebergröße: 10–500 Mitarbeiter (wo verfügbar)

**C — Retargeting.** Alle Besucher der Landing Page ohne Terminbuchung (180 Tage), Video-Viewer ≥ 25 %, Instagram-/Facebook-Interaktion 365 Tage. Hier laufen die Einwand-Anzeigen (Datenschutz, Aufwand, „ist das ein Wiki?“).

> **Policy-Hinweis:** Keine Sonderkategorie (kein Job-, Kredit- oder Wohnungsangebot), also normales Targeting erlaubt. Aber Metas Regel zu *persönlichen Attributen* gilt: **nicht** „Sie gehen bald in Rente“ oder „Sind Sie über 60?“. Immer über das Unternehmen formulieren: „Wenn Ihr erfahrenster Kollege geht …“. Das ist erlaubt und wirkt ohnehin besser.

---

## 3. Creatives

Sechs Winkel, mindestens 4 davon gleichzeitig live. Pro Winkel 1 Bild/Video + 2 Textvarianten.

### Winkel 1 — Der Kampagnen-Claim (Hauptmotiv)

> **Primary Text**
> Ihr erfahrenster Mitarbeiter geht in zwei Jahren in Rente.
>
> Was er weiß, steht in keinem Handbuch: warum die Anlage so gebaut ist, welcher Lieferant zweimal falsch geliefert hat, was man bei dem einen Kunden besser nicht anbietet.
>
> Die Übergabe besteht meistens aus drei Wochen Mitlaufen und dem Satz „Ruf einfach an, wenn was ist“.
>
> Wir holen dieses Wissen aus den Köpfen und aus Ihren Ordnern, bringen es in eine Form und machen es durchsuchbar — für Ihre Mitarbeiter und für KI. Alles auf Hardware in Ihrem Haus.
>
> **Headline:** Damit Erfahrung nicht in Rente geht
> **Description:** Kostenloses 30-Min-Erstgespräch
> **CTA:** Termin buchen

**Visual:** Textkarte im Seitenstil (Papierfarbe #FAF8F5, Inter, Goldakzent) — Zeile 1 durchgestrichen „Wissen im Kopf“, Zeile 2 „Wissen im Unternehmen“. Oder ein ruhiges Realfoto: älterer Facharbeiter an der Maschine, kein Stock-KI-Motiv, keine Roboterhände.

---

### Winkel 2 — Der Anruf beim Ehemaligen (Story)

> Letztes Jahr im Sommer stand die Linie. Der Fehler war schon einmal da, vor sechs Jahren.
>
> Der Einzige, der wusste warum, war seit acht Monaten in Rente. Also hat ihn jemand privat angerufen — abends, auf dem Handy.
>
> Es hat funktioniert. Nur ist das keine Betriebsorganisation, sondern Glück.
>
> **Headline:** Wenn der Ehemalige die einzige Quelle ist
> **CTA:** Mehr dazu

**Visual:** 9:16-Video oder Karussell mit drei Karten: „Störung“ → „Gab es schon mal“ → „Wer weiß das noch?“.

---

### Winkel 3 — Abgrenzung (Provokation, für kalte Zielgruppe stark)

> Alle reden über KI. Kaum jemand redet über die Voraussetzung.
>
> Eine KI, die auf ein zwanzig Jahre gewachsenes Laufwerk losgelassen wird, antwortet genau in der Qualität dieser Ablage. Das Problem ist selten das Modell. Das Problem sind die Daten.
>
> Wir fangen deshalb nicht mit der Technik an, sondern mit einer Sichtung: was vorhanden ist, was doppelt ist und was nur in Köpfen steckt. Das bekommen Sie schriftlich — auch wenn Sie danach nichts weiter mit uns machen.
>
> **Headline:** KI beginnt mit guten Daten
> **Description:** Sichtung mit schriftlichem Bericht
> **CTA:** Mehr erfahren

---

### Winkel 4 — Ablage-Schmerz (breitester Winkel)

> „Das haben wir doch irgendwo.“
>
> Ja. Im Protokoll von 2019, im Postfach eines Kollegen oder in einem Ordner im Archiv. Nur dauert das Suchen länger als das Nachfragen — also fragt man weiter nach.
>
> Wir machen Ihr Unternehmenswissen so auffindbar, dass eine Frage in einem Satz reicht. Jede Antwort mit Quelle und Datum. Ohne Cloud.
>
> **Headline:** Endlich wissen, wo alles steht
> **CTA:** Termin buchen

**Visual:** Screenshot-artige Karte im Stil des Hero-Mockups (Frage oben, Antwort mit Beleg unten).

---

### Winkel 5 — Datenschutz-Einwand (Retargeting)

> „Unsere Unterlagen kommen in keine Cloud.“ Richtig — und genau deshalb bauen wir es anders.
>
> Sprachmodell, Transkription und Suche laufen auf Hardware in Ihrem Netzwerk. Keine Verbindung nach außen, nichts an OpenAI oder Microsoft. Deshalb funktioniert das auch bei vertraulichen Vorgängen, bei denen ChatGPT ausscheidet.
>
> **Headline:** Ihr Wissen bleibt im Haus
> **CTA:** Mehr erfahren

---

### Winkel 6 — Zeitdruck, sachlich (Retargeting / später im Funnel)

> Ordnung in der Ablage können Sie jederzeit nachholen.
>
> Das Gespräch mit dem Kollegen, der Ende des Jahres geht, nicht.
>
> **Headline:** Solange er noch da ist
> **CTA:** Termin buchen

---

### Hook-Bank (erste Zeile, austauschbar)

- „Ihr erfahrenster Mitarbeiter geht in zwei Jahren in Rente.“
- „Die Übergabe war drei Wochen lang. Die Fragen kamen zwei Jahre.“
- „Man ruft immer denselben Kollegen an. Bis man es nicht mehr kann.“
- „34 Berufsjahre. Ein letzter Arbeitstag.“
- „Alle reden über KI. Ihre Daten liegen noch auf dem Laufwerk von 2006.“
- „Was passiert, wenn er nicht mehr ans Telefon geht?“
- „Erfahrung gehört dem Unternehmen. Vorausgesetzt, sie ist irgendwo festgehalten.“

---

## 4. Video-Skript (30 Sek., 9:16, für Reels)

| Sek. | Bild | Text/Voice |
|---|---|---|
| 0–3 | Nahaufnahme: Hand an einer alten Maschine | „Der Kollege, den man bei jedem Sonderfall geholt hat, geht Ende des Jahres.“ |
| 3–8 | Ordnerrücken, Laufwerk-Screenshot | „Was er weiß, steht in keinem Handbuch.“ |
| 8–14 | Übergabe-Szene, zwei Leute am Rechner | „Die Übergabe: drei Wochen mitlaufen, dann ‚ruf einfach an‘.“ |
| 14–22 | Mockup der Wissensauskunft (Frage → Antwort mit Beleg) | „Wir holen das Wissen aus Gesprächen und Ihren Unterlagen und machen es durchsuchbar. Jede Antwort mit Quelle.“ |
| 22–27 | Serverschrank im Betrieb | „Alles im eigenen Haus. Nichts geht in die Cloud.“ |
| 27–30 | Claim-Karte | „Damit Erfahrung nicht in Rente geht. 30 Minuten Erstgespräch, kostenlos.“ |

Untertitel einbrennen — der Großteil sieht das ohne Ton.

---

## 5. Bildsprache (was funktioniert, was nicht)

**Ja:** echte Betriebe, Werkstatt, Leitstand, Aktenordner, ältere Facharbeiter, Papier und Haarlinien im Stil der Website, ruhige Textkarten mit einem einzigen Goldakzent.

**Nein:** blaue Roboterhände, Gehirn-Grafiken mit Platinen, lachende Stockfoto-Teams, „AI“-Schriftzüge. Das ist genau die Bildwelt, gegen die die Positionierung antritt.

---

## 6. Messung und Auswertung

- **Landing-Page-URL mit UTM:**
  `https://www.smartwandler.de/wissen-geht-in-rente.html?utm_source=meta&utm_medium=paid&utm_campaign=wissenstransfer&utm_content={{ad.name}}`
  (Matomo wertet das aus, sobald Statistik-Consent vorliegt.)
- **Namenskonvention:** `SW | <Ziel> | <Zielgruppe> | <Winkel> | <Format>`, z. B. `SW | Leads | Broad | Rente-Claim | 4:5`
- **Primäre Kennzahl:** Kosten je gebuchtem Termin. Sekundär: Landingpage-Views, Video-Hold-Rate ≥ 25 %, Scrolltiefe bis „Vorgehen“.
- **Nach 14 Tagen entscheiden:** Winkel mit < 0,8 % CTR und ohne Landingpage-Views abschalten; besten Winkel mit 2 neuen Hooks nachbauen. Immer den Hook variieren, nicht die ganze Anzeige neu bauen — die erste Zeile entscheidet fast alles.
- **Vor dem Live-Gang:** Test-Events prüfen (Browser + Server mit gleicher `event_id`), einmal mit aktivem Adblocker gegentesten. Ablauf steht in `PROCESS.md`.

---

## 7. Realistische Erwartung

Das ist ein beratungsintensives Angebot mit langem Entscheidungsweg — Meta liefert hier keine Termine im Minutentakt. Der wahrscheinlichere Verlauf: Reichweite über den emotionalen Claim aufbauen, Retargeting auf Einwände, und ein Teil der Anfragen kommt später direkt über die Website, ohne dass Meta sie sich zuschreiben kann. Deshalb neben dem Pixel-CPL auch mitzählen, was im Erstgespräch auf die Frage „Wie sind Sie auf uns gekommen?“ geantwortet wird.

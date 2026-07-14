# Konzept: Detaillierten Report per Mail aufwerten

> Ziel dieses Dokuments: Die Report-Mail (`report-template.brevo.html`) von einer
> „hübschen Zusammenfassung" zu einem **eigenständigen, wertvollen Dokument** machen,
> das spürbar mehr liefert als das Sofort-Ergebnis im Browser — und damit die
> E-Mail-Adresse *rückwirkend rechtfertigt* und Autorität aufbaut.
>
> Bezug: `stand.md` Punkt 1 („Report stark verbessern"), `CONTEXT.md` Abschnitt 3
> (Zwei-Ebenen-Ergebnis: Spitze im Browser, **Tiefe** in der Mail).
> Diese Datei ist **nicht** die Nurture-Reihe (Epic 4) — die kommt bewusst später,
> siehe Abschnitt „Abgrenzung" ganz unten.

---

## 1. Warum überhaupt aufwerten — das strategische Argument

Der Browser zeigt die **Spitze**: die €-Zahl + Call-Button. Das ist der heißeste
Conversion-Moment, bewusst schlank (C6). Wer *jetzt* bucht, ist eh weg aus der Mail.

Die Mail bekommt also **die anderen 90 %** — die, die die Adresse gegeben, aber
*nicht sofort* gebucht haben. Für die ist die Mail:

1. **Der Beweis, dass die Adresse sich gelohnt hat.** Wenn die Mail nur die
   Browser-Info wiederholt, fühlt sich der Lead veräppelt → keine Antwort, kein
   späteres Buchen. Die Mail muss *mehr* liefern als der Browser, sichtbar.
2. **Der Autoritäts-Anker.** Ein Report, der zeigt „die verstehen meinen Betrieb
   und haben sowas schon gebaut", verkauft das Erstgespräch von selbst.
3. **Das Dokument, das liegen bleibt.** Eine gute Report-Mail wird abgespeichert,
   weitergeleitet („guck mal, was der schreibt") und Wochen später nochmal geöffnet.
   Genau *dann* soll der Termin-Button noch da sein.

**Faustregel für „länger als der Browser":** Der Browser ist ~1 Bildschirm.
Die Mail darf **3–4× so lang** sein — solange jeder Block einen eigenen Nutzen hat
und nicht bloß Fülltext ist. Länge durch *Substanz*, nicht durch Wiederholung.

---

## 2. Der neue Aufbau (Ist → Soll)

Die bestehende Mail hat: Header · €-Spanne · Routing-Kernaussage · Branchen-Block ·
Zeitfresser-Blöcke · CTA · Footer. Das ist die Basis — wir **erweitern**, nicht ersetzen.

```
┌────────────────────────────────────────────────────────────┐
│  A  Header + Anrede + €-Spanne              (bleibt)         │
│  B  Einordnung / Routing-Kernaussage        (bleibt)         │
│ ─────────────────────────────────────────────────────────── │
│ ★C  PRAXISFALL: „Was ein Betrieb wie deiner   ← NEU, der     │
│      schon automatisiert hat"                    Kern-Upgrade │
│  D  Für deine Branche                       (bleibt, kürzen) │
│ ★E  Deine Zeitfresser — jetzt MIT Mini-       ← erweitert:   │
│      Beispiel + grober Aufwand pro Punkt         konkreter    │
│ ★F  „So läuft so ein Projekt ab" (3 Schritte) ← NEU          │
│ ★G  Datensicherheit / DSGVO-Trust-Block       ← NEU (routed) │
│ ★H  Demo-Video (EIN Link, als Poster)         ← NEU, optional │
│  I  EINE CTA: Erstgespräch buchen           (bleibt, betonen)│
│ ★J  Wer ist Philipp (Micro-Bio + Referenzen)  ← NEU          │
│  K  Footer / Rechtliches                    (bleibt)         │
└────────────────────────────────────────────────────────────┘
```

Prinzip: **eine** Handlung (Termin), aber **mehrere** Beweise davor. Der Lead soll
am Ende der Mail denken „die wissen, was sie tun, und es klingt machbar" — *dann*
ist der Button überzeugend.

---

## 3. ★ Block C — der Praxisfall (das eigentliche Upgrade)

Das ist genau der Teil, den du wolltest: **„Was haben andere Betriebe der gleichen
Branche schon automatisiert?"** Konkret, mit Vorher/Nachher und einer Stundenzahl.
Das ist der stärkste einzelne Hebel des ganzen Reports — nichts überzeugt einen
Handwerker mehr als „ein anderer Handwerker macht das schon".

**Regeln für den Praxisfall:**
- **Anonymisiert, aber konkret:** „Ein Elektrobetrieb aus der Region mit 8 Mitarbeitern"
  — kein echter Kundenname (rechtlich sauber, wirkt trotzdem echt). Keine erfundenen
  Logos/Testimonials.
- **Eine Zahl, ehrlich als Spanne / „rund":** „spart heute rund 5–7 Stunden pro Woche" —
  passt zur Ehrlichkeits-Linie des Checks (C7, keine Scheinpräzision).
- **Vorher-Schmerz → was gebaut wurde → Ergebnis.** Drei Sätze reichen.
- **Branchenspezifisch** über `BRANCHE_KEY` (Template-Logik, **kein neuer Param nötig**).

### Fertige Textbausteine je Branche (in `{% if %}`-Blöcke)

**handwerk_bau**
> **Aus der Praxis: ein Elektrobetrieb, 8 Mitarbeiter, aus der Region.**
> Vorher hat der Chef abends Angebote aus alten Word-Dateien zusammenkopiert und
> Baustellenfotos von Hand in Ordner sortiert. Heute erzeugt das System Angebote aus
> Vorlagen mit Preisen aus den Stammdaten, und jedes Foto landet automatisch beim
> richtigen Auftrag. Ergebnis: rund **5–7 Stunden pro Woche** zurück — und Angebote
> gehen am selben Tag raus statt erst am Wochenende.

**handel_ecommerce**
> **Aus der Praxis: ein Online-Händler, 12 Mitarbeiter.**
> Bestellungen wurden aus dem Shop von Hand ins Warenwirtschaftssystem und in die
> Buchhaltung übertragen — dreimal dieselben Daten. Jetzt sind Shop, Lager und
> Buchhaltung verbunden: Eine Bestellung fließt automatisch durch, Bestände stimmen
> in Echtzeit. Ergebnis: rund **6–8 Stunden Tipparbeit pro Woche** weg, deutlich
> weniger Fehler bei Retouren.

**dienstleistung**
> **Aus der Praxis: eine Beratung, 6 Mitarbeiter.**
> Das Drumherum fraß die Zeit: Angebote schreiben, Termine hin- und herschieben,
> hinterhertelefonieren. Heute schlägt das System Termine selbst vor, fasst
> automatisch nach und legt die Doku pro Mandat richtig ab. Ergebnis: rund **4–6
> Stunden pro Woche** zurück am eigentlichen Kundengeschäft statt an Verwaltung.

**produktion**
> **Aus der Praxis: ein Fertigungsbetrieb, 15 Mitarbeiter.**
> Auftrags- und Maschinendaten wurden auf Zetteln erfasst und abends abgetippt.
> Jetzt werden Rückmeldungen direkt digital erfasst, die Schichtplanung läuft
> halbautomatisch, Berichte entstehen auf Knopfdruck. Ergebnis: rund **6–9 Stunden
> pro Woche** weniger Papierkram — und der Chef sieht den Auftragsstand in Echtzeit.

**gesundheit_pflege**
> **Aus der Praxis: ein Pflegedienst, 14 Mitarbeiter.**
> Doku, Dienstplan und Abrechnung liefen auf Papier und in drei getrennten Programmen.
> Heute läuft das zusammen — **datensicher, komplett in der EU-Cloud**. Ergebnis: rund
> **5–8 Stunden pro Woche** weniger Verwaltung, und die Doku ist bei einer Prüfung
> sofort vollständig auffindbar.

**kanzlei**
> **Aus der Praxis: eine Kanzlei, 7 Mitarbeiter.**
> Fristen wurden von Hand in den Kalender übertragen, Akten mehrfach angelegt.
> Jetzt entstehen Aktenanlage und Fristenkontrolle automatisch aus dem Posteingang —
> **ohne dass Mandantendaten in fremde Clouds wandern** (EU-Cloud oder bei Ihnen vor
> Ort). Ergebnis: rund **5–7 Stunden pro Woche** zurück und deutlich weniger
> Fristen-Stress.

**sonstige**
> **Aus der Praxis: ein Betrieb mit 10 Mitarbeitern aus der Region.**
> Überall dort, wo Aufgaben nach festem Muster wiederkehrten — E-Mails sortieren,
> Daten übertragen, Berichte zusammenstellen — haben wir Schritt für Schritt
> automatisiert. Ergebnis: rund **5 Stunden pro Woche** zurück, ohne dass das Team
> seine gewohnte Arbeitsweise umkrempeln musste.

> **Wichtig:** Solange das echte, benennbare Referenzkunden sind, vorher deren
> Einverständnis holen. Solange anonymisiert („ein Elektrobetrieb der Region"),
> ist es als typisiertes Praxisbeispiel unkritisch — aber **keine erfundenen
> Zahlen als Fakten verkaufen**; „rund" / Spanne hält es ehrlich (C7).

---

## 4. ★ Block E — Zeitfresser mit Fleisch

Die bestehenden Zeitfresser-Blöcke sind gut, aber generisch. Jeder angeklickte
Zeitfresser bekommt zusätzlich **(a)** ein Ein-Satz-Beispiel „so löst man das
konkret" und **(b)** eine grobe Aufwands-Orientierung, damit es machbar wirkt.

Beispiel (ZF_ANGEBOTE), erweitert:
> **Angebote & Rechnungen schreiben**
> Aus Vorlagen automatisch erzeugen, Positionen & Preise aus den Stammdaten ziehen,
> Versand und Zahlungs-Nachverfolgung automatisieren.
> *Typischer Einstieg: eine smarte Angebotsvorlage — meist in wenigen Tagen startklar,
> spart pro Beleg mehrere Minuten.*

Die Aufwands-Zeile („in wenigen Tagen startklar") nimmt die größte unausgesprochene
Angst des KMU-Chefs: „Das wird ein Monster-Projekt." → tut es nicht.

---

## 5. ★ Block F — „So läuft so ein Projekt ab"

Drei Schritte, die das Ganze entzaubern. Statisch für alle, kein Param nötig:

> **1. Erstgespräch (30 Min, kostenlos).** Wir schauen uns deine Top-Zeitfresser an
> und du bekommst konkrete Ansatzpunkte — auch wenn du danach nichts mit uns machst.
> **2. Kleiner Start.** Wir fangen mit *einem* Prozess an, der sofort spürbar
> entlastet — kein Monate-Projekt, kein Umbau des ganzen Betriebs.
> **3. Schritt für Schritt erweitern.** Was funktioniert, bauen wir aus. Festpreis,
> kein Abo-Zwang, du behältst die Kontrolle.

Das adressiert direkt Frage 6 (Einwände „zu teuer", „unsicher was geht").

---

## 6. ★ Block G — Datensicherheit / DSGVO (routed)

Der Differenzierer aus `CONTEXT.md` Abschnitt 5 gehört in den Report — aber als
**Vertrauens-Block**, nicht als Technik-Vortrag. Nur einblenden, wenn relevant
(Branche Gesundheit/Kanzlei ODER Frage 6 = „Daten in Clouds / kein gutes Gefühl"):

> **Deine Daten bleiben, wo du sie haben willst.**
> Wir arbeiten wahlweise DSGVO-konform in der EU-Cloud oder komplett bei dir vor Ort
> (On-Premise) — nichts wandert ungefragt in US-Clouds. Was für deinen Betrieb passt,
> klären wir im Gespräch.

Bei „Software zu teuer" stattdessen der Festpreis-Block (schon vorhanden).

---

## 7. ★ Block H — Demo-Video: ja, aber genau EINS und richtig platziert

**Deine Frage: Video-Link rein — oder wird's Spammy?**

**Meine klare Empfehlung: Ja, EIN Demo-Video rein — es wertet auf, wird nicht zu Spam.**
Der Grund, warum Links „spammy" wirken, ist *Vielzahl und Beliebigkeit*, nicht
Existenz. Spam = zehn Links, drei CTAs, „klick hier / und hier / und hier". Ein
**einzelnes, thematisch passendes Beweis-Element** ist das Gegenteil — es macht
abstrakte Automatisierung **sichtbar**. „Zeigen schlägt beschreiben."

**So platzieren, dass es Asset statt Spam ist:**

1. **Genau ein Link.** Die Mail hat weiterhin **eine** Handlung: Termin buchen.
   Das Video ist ein *Beweis*, keine zweite konkurrierende CTA. Deshalb dezenter
   gestalten als den Buch-Button (kein zweiter greller Button).
2. **Als Poster-Thumbnail, nicht als roher Link.** In E-Mail spielt Video nicht
   zuverlässig inline. Nimm `smartwandler-demo-poster.jpg` als klickbares Bild mit
   Play-Overlay, verlinkt auf die gehostete Video-Seite (z. B. auf smartwandler.de
   eingebettet, **nicht** die 120-MB-Datei direkt). Das 720p-File
   (`smartwandler-demo-720p.mp4`) ist die richtige Quelle für die Web-Einbettung.
3. **Kontextuell platzieren, direkt nach dem Praxisfall (Block C) oder vor der CTA.**
   Mit einer Bildunterschrift, die neugierig macht statt zu betteln:
   > *In 90 Sekunden gezeigt: wie so eine Automatisierung im Alltag aussieht.* ▶

4. **Deliverability-Hinweis:** Bei kalten Erstmails zählt jeder Link etwas gegen
   die Zustellbarkeit. **Ein** Video-Link + **ein** Termin-Link + Footer-Pflichtlinks
   ist absolut im grünen Bereich. Erst ab ~5–7 Content-Links wird's kritisch.
   → Also: reingehen, aber die Zahl der Links insgesamt niedrig halten.

**Wann Video weglassen?** Nur, wenn die Demo inhaltlich *nicht* zum KMU-Alltag
passt (zu technisch, zu Enterprise). Dann lieber kein Video als ein verwirrendes.
Wenn die Demo den Nutzen zeigt → rein damit.

**Optionaler Param:** `VIDEO_URL` als Brevo-Param (Landing mit eingebettetem Video),
damit du den Link ohne Template-Änderung wechseln kannst. Falls fix, hardcoden ist ok.

---

## 8. ★ Block J — Wer ist Philipp (Autorität am Ende)

Der Micro-Trust aus der Ergebnisseite gehört ausgebaut in die Mail — hier ist Platz:

> **Wer sich das anschaut:** Philipp — 15+ Jahre Enterprise-IT (u. a. Mercedes, VW),
> heute mit smartwandler auf KMU in der Region spezialisiert. Kein Verkaufsdruck,
> kein Technik-Kauderwelsch: Wir übersetzen, was bei *dir* konkret Zeit spart.

Enterprise-Referenzen + regionaler Fokus = „großes Können, aber versteht den kleinen
Betrieb". Genau die Positionierung aus `CONTEXT.md`.

---

## 9. Implementierungs-Notizen (für die Umsetzung in `report-template.brevo.html`)

- **Keine neuen Pflicht-Params** außer optional `VIDEO_URL`. Praxisfall,
  Projektablauf, Bio, DSGVO-Block laufen alle über **vorhandene** Werte
  (`BRANCHE_KEY`, `ZF_*`, `ZUFRIEDENHEIT` bzw. das schon berechnete Routing).
- **Reihenfolge** wie im Schema Abschnitt 2 einbauen; bestehende Blöcke bleiben,
  nur Branchen-Block (D) leicht kürzen, damit er sich nicht mit dem Praxisfall (C)
  doppelt.
- **DSGVO-Block (G) an dieselbe Bedingung hängen**, die schon HEADLINE/BODY routet
  (Gesundheit/Kanzlei ODER Zufriedenheit = „Daten in Clouds") — dann bleibt die
  Logik an einer Stelle konsistent.
- **Ein einziger gefüllter Button** (Termin). Video = Bild-Link, Footer-Links dezent.
- **Mobil testen:** Die Mail wird deutlich länger → auf iPhone/Gmail-App gegenlesen,
  dass Blöcke nicht brechen. Brevo-Testversand an eigene Adresse + Litmus/Mail-Tester
  optional.
- **Betreff** kann Praxisfall aufgreifen, um Öffnungsrate zu heben, z. B.:
  `Dein Potenzial: {{ params.MIN }}–{{ params.MAX }} € — und wie ein Betrieb wie deiner das schon macht`

---

## 10. Abgrenzung: Das ist NICHT die Nurture-Reihe

Bewusst getrennt, wie von dir gewünscht:

- **Dieser Report** = **eine transaktionale Mail** (Art. 6 I b, angeforderter Dienst,
  geht an **alle**, die die Adresse gegeben haben, ohne Consent-Häkchen — C2).
  Sie muss **zum Kampagnen-Launch fertig sein**, denn ohne guten Report ist das
  Mail-Gate wertlos.
- **Die Nurture-Reihe** (Epic 4: 4–5 Mails, DSGVO/Kosten/Einladung) = **Marketing**,
  nur mit Consent-Häkchen + Double-Opt-In, geht **erst später** live. Kommt
  **nicht** zum Launch — genau wie du gesagt hast.

Der aufgewertete Report trägt also die ganze Last des „Nachfassens" allein, bis die
Nurture-Reihe steht. Umso wichtiger, dass er stark ist. Wenn die Nurture-Reihe später
kommt, kann sie einzelne Blöcke dieses Reports als Aufhänger vertiefen (z. B. den
Praxisfall zu einer ganzen Case-Study-Mail ausbauen).

---

## 11. Umsetzungs-Reihenfolge (Vorschlag)

1. Block C (Praxisfall) je Branche einbauen — **größter Hebel, zuerst.**
2. Block F (Projektablauf) + Block J (Bio) — statisch, schnell gemacht.
3. Block E (Zeitfresser-Beispiele + Aufwand) erweitern.
4. Block G (DSGVO) an bestehende Routing-Bedingung hängen.
5. Block H (Video-Poster) + optional `VIDEO_URL`-Param.
6. Betreff anpassen, mobil testen, Brevo-Testversand.
```

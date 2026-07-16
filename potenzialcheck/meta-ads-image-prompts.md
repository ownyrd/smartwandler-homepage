# HTML-Prompts für die 5 Static Creatives (Meta Ads)

Gehören zu `meta-ads-creatives.md`. **Jeder Prompt ist eigenständig** — du kopierst
pro Bild genau EINEN Block (alles zwischen den ═══-Linien, ab „Erstelle…" bis vor
die nächste ═══-Linie). Stil, Layout, Technik und Text sind in jedem Block komplett
enthalten, du musst nichts kombinieren.

Ausgabe ist **HTML**: Der Text bleibt exakt (keine KI-Textfehler) und ist editierbar.
Du öffnest die .html im Browser, passt bei Bedarf den Text an und exportierst dann
selbst als PNG bzw. PDF (Screenshot oder Druck-zu-PDF).

Meta-Vorgaben, die in jedem Prompt stecken:
- Seitenverhältnis 4:5 (fix, 0 % Abweichung, damit die 3 %-Toleranz sicher passt)
- Fläche 1080 × 1350 px (erfüllt Mindestmaße 600 breit / 750 hoch locker)
- Exportdatei bleibt weit unter 30 MB (bei 1080 × 1350 PNG kein Thema)

Finalisierte Standardwerte (aus Creative 1, gelten für alle):
- Kicker ca. 25 px, Uppercase, gut lesbar, mit kurzer Goldlinie davor
- Headline ca. 76 px semibold, enge Laufweite (bei langen Headlines etwas kleiner)
- warmer Verlauf-Hintergrund + Gold-Glow hinter dem Motiv (siehe je Prompt)
- Footer unten rechts: echtes Logo-Lockup neben der Wortmarke

═══════════════════════════════════════════════════════════════════════════════
CREATIVE 1 · Der laufende Verlust (die verdeckte Zahl)
═══════════════════════════════════════════════════════════════════════════════

Erstelle eine eigenständige HTML-Datei (eine .html, alle Styles im <style>, optional
Google Font „Inter", sonst keine externen Abhängigkeiten), die ein statisches
Werbe-Creative für Meta Ads rendert.

Technik/Format:
- Die Creative-Fläche ist ein Container von exakt 1080 × 1350 px (Seitenverhältnis
  4:5, keine Abweichung). Erfüllt Mindestmaße 600 × 750 px.
- Alle Texte als echte, editierbare HTML-Textelemente (kein Text als Bild), damit
  ich sie direkt im Code oder im Browser ändern kann.
- Motive als CSS/SVG umsetzen, nicht als Rasterbild. Keine externen Bilder.
- Ich exportiere danach manuell als PNG/PDF; die Exportdatei bleibt unter 30 MB.

Markenstil smartwandler (warm, editorial, ruhig, hochwertig; KEIN Tech-Look, KEINE
Stockfotos, KEIN Neon, KEINE Roboter, KEINE Menschen):
- Hintergrund: warmer Verlauf statt flachem Weiß: linear-gradient(158deg, #FAF8F5, #F4EEE4, #ECE4D6), dazu ein dezenter radialer Gold-Glow rgba(200,169,106,0.16) hinter dem Motiv
- Haupttext #3A3631, sekundärer Text #5F5952, kleine Labels #7C766C
- Akzent: gedecktes Gold #C8A96A (dezent, als Linie/Highlight)
- Schrift: Inter; Headline semibold, enge Laufweite, linksbündig, viel Weißraum;
  abgerundete Ecken (16 px) bei Boxen

Layout:
- Oben links ein KICKER: kurze goldene Linie, dahinter Uppercase-Text in #7C766C:
  „FÜR GESCHÄFTSFÜHRER IM RAUM DRESDEN (BIS 20 MITARBEITER)"
- Darunter die HEADLINE groß in #3A3631, dominiert die Fläche:
  „Ihr Betrieb verliert gerade Geld durch Routinearbeit. Die Frage ist nur: wie viel?"
- Motiv (genau EIN Element, als CSS/SVG): eine große, seriös gesetzte Euro-Zahl,
  deren Ziffern durch weiche goldene Balken (#C8A96A) unkenntlich gemacht sind, wie
  geschwärzt: „██.███ €". Klein darunter in #5F5952: „pro Jahr". Wirkung: die Zahl
  existiert, man kennt sie nur noch nicht. Kein Alarm-Rot, wie eine edle
  Finanzübersicht.
- Unten rechts ein Lockup: echte smartwandler-Bildmarke (logo-small.png, ca. 74 px) links neben der Wortmarke „smartwandler" (#3A3631), darunter in #7C766C:
  „Kostenloser Potenzial-Check · 2 Minuten"

Alle Texte exakt wörtlich, deutsche Umlaute korrekt, keine Gedankenstriche.

═══════════════════════════════════════════════════════════════════════════════
CREATIVE 2 · Der Feierabend-Moment (21 Uhr)
═══════════════════════════════════════════════════════════════════════════════

Erstelle eine eigenständige HTML-Datei (eine .html, alle Styles im <style>, optional
Google Font „Inter", sonst keine externen Abhängigkeiten), die ein statisches
Werbe-Creative für Meta Ads rendert.

Technik/Format:
- Die Creative-Fläche ist ein Container von exakt 1080 × 1350 px (Seitenverhältnis
  4:5, keine Abweichung). Erfüllt Mindestmaße 600 × 750 px.
- Alle Texte als echte, editierbare HTML-Textelemente (kein Text als Bild).
- Motive als CSS/SVG umsetzen, nicht als Rasterbild. Keine externen Bilder.
- Ich exportiere danach manuell als PNG/PDF; die Exportdatei bleibt unter 30 MB.

Markenstil smartwandler (warm, editorial, ruhig, hochwertig; KEIN Tech-Look, KEINE
Stockfotos, KEIN Neon, KEINE Roboter, KEINE Menschen). Diese Variante als
Dark-Mode-Blickfang:
- Hintergrund: warmes Dunkelbraun #3A3631
- Haupttext #FAF8F5, sekundärer Text #C9C3BA, kleine Labels #A79F94
- Akzent: gedecktes Gold #C8A96A
- Schrift: Inter; Headline semibold, enge Laufweite, linksbündig, viel Weißraum;
  abgerundete Ecken (16 px) bei Boxen

Layout:
- Oben links ein KICKER: kurze goldene Linie, dahinter Uppercase-Text in #A79F94:
  „CHEFSACHE IM SÄCHSISCHEN MITTELSTAND"
- Darunter die HEADLINE groß in #FAF8F5, dominiert die Fläche:
  „Tagsüber Chef, abends Sachbearbeiter." (kurz, groß, darf dominieren)
- Motiv (genau EIN Element, als SVG): eine schlichte Linien-Illustration einer Uhr,
  die 21:07 zeigt (feine Konturlinien in #FAF8F5, Stundenzeiger in Gold #C8A96A),
  daneben angedeutet ein kleiner Stapel aus drei Blättern als Strichzeichnung,
  oberstes Blatt mit der Titelzeile „Angebot". Ruhig, leicht melancholisch.
- Unten rechts ein Lockup: smartwandler-Bildmarke in Weiß (logo-white.png, ca. 74 px) links neben der Wortmarke „smartwandler" (#FAF8F5), darunter in #A79F94:
  „Kostenloser Potenzial-Check · 2 Minuten"

Alle Texte exakt wörtlich, deutsche Umlaute korrekt, keine Gedankenstriche.

═══════════════════════════════════════════════════════════════════════════════
CREATIVE 3 · Die eine Zahl, die fehlt (Kennzahlen-Liste)
═══════════════════════════════════════════════════════════════════════════════

Erstelle eine eigenständige HTML-Datei (eine .html, alle Styles im <style>, optional
Google Font „Inter", sonst keine externen Abhängigkeiten), die ein statisches
Werbe-Creative für Meta Ads rendert.

Technik/Format:
- Die Creative-Fläche ist ein Container von exakt 1080 × 1350 px (Seitenverhältnis
  4:5, keine Abweichung). Erfüllt Mindestmaße 600 × 750 px.
- Alle Texte als echte, editierbare HTML-Textelemente (kein Text als Bild).
- Motive als CSS/SVG umsetzen, nicht als Rasterbild. Keine externen Bilder.
- Ich exportiere danach manuell als PNG/PDF; die Exportdatei bleibt unter 30 MB.

Markenstil smartwandler (warm, editorial, ruhig, hochwertig; KEIN Tech-Look, KEINE
Stockfotos, KEIN Neon, KEINE Roboter, KEINE Menschen):
- Hintergrund: warmer Verlauf statt flachem Weiß: linear-gradient(158deg, #FAF8F5, #F4EEE4, #ECE4D6), dazu ein dezenter radialer Gold-Glow rgba(200,169,106,0.16) hinter dem Motiv
- Haupttext #3A3631, sekundärer Text #5F5952, kleine Labels #7C766C
- Akzent: gedecktes Gold #C8A96A; helle Gold-Fläche für die Karte #F7F0E3
- Schrift: Inter; Headline semibold, enge Laufweite, linksbündig, viel Weißraum;
  abgerundete Ecken (16 px) bei Boxen

Layout:
- Oben links ein KICKER: kurze goldene Linie, dahinter Uppercase-Text in #7C766C:
  „DER 2-MINUTEN-TEST FÜR ENTSCHEIDER"
- Darunter die HEADLINE groß in #3A3631, dominiert die Fläche:
  „Sie kennen jede Zahl in Ihrem Betrieb. Diese eine vermutlich nicht."
- Motiv (genau EIN Element, als CSS): eine aufgeräumte Karte mit hellem
  Gold-Hintergrund #F7F0E3, abgerundete Ecken, mit vier Listenzeilen:
      ✓ Umsatz
      ✓ Marge
      ✓ Auslastung
      ? Gebundenes Kapital in Routinearbeit
  Die drei Häkchen in Gold #C8A96A, ihre Zeilen in #5F5952. Die letzte Zeile mit
  großem goldenem Fragezeichen und Text in #3A3631 semibold. Das Fragezeichen ist
  der Star, wie ein Kennzahlen-Board.
- Unten rechts ein Lockup: echte smartwandler-Bildmarke (logo-small.png, ca. 74 px) links neben der Wortmarke „smartwandler" (#3A3631), darunter in #7C766C:
  „Kostenloser Potenzial-Check · 2 Minuten"

Alle Texte exakt wörtlich, deutsche Umlaute korrekt, keine Gedankenstriche.

═══════════════════════════════════════════════════════════════════════════════
CREATIVE 4 · Rechnet sich das? (Gauge / ROI ohne Bauchgefühl)
═══════════════════════════════════════════════════════════════════════════════

Erstelle eine eigenständige HTML-Datei (eine .html, alle Styles im <style>, optional
Google Font „Inter", sonst keine externen Abhängigkeiten), die ein statisches
Werbe-Creative für Meta Ads rendert.

Technik/Format:
- Die Creative-Fläche ist ein Container von exakt 1080 × 1350 px (Seitenverhältnis
  4:5, keine Abweichung). Erfüllt Mindestmaße 600 × 750 px.
- Alle Texte als echte, editierbare HTML-Textelemente (kein Text als Bild).
- Motive als CSS/SVG umsetzen, nicht als Rasterbild. Keine externen Bilder.
- Ich exportiere danach manuell als PNG/PDF; die Exportdatei bleibt unter 30 MB.

Markenstil smartwandler (warm, editorial, ruhig, hochwertig; KEIN Tech-Look, KEINE
Stockfotos, KEIN Neon, KEINE Roboter, KEINE Menschen):
- Hintergrund: warmer Verlauf statt flachem Weiß: linear-gradient(158deg, #FAF8F5, #F4EEE4, #ECE4D6), dazu ein dezenter radialer Gold-Glow rgba(200,169,106,0.16) hinter dem Motiv
- Haupttext #3A3631, sekundärer Text #5F5952, kleine Labels #7C766C
- Akzent: gedecktes Gold #C8A96A
- Schrift: Inter; Headline semibold, enge Laufweite, linksbündig, viel Weißraum;
  abgerundete Ecken (16 px) bei Boxen

Layout:
- Oben links ein KICKER: kurze goldene Linie, dahinter Uppercase-Text in #7C766C:
  „FÜR GESCHÄFTSFÜHRER IM RAUM DRESDEN (BIS 20 MITARBEITER)"
- Darunter die HEADLINE groß in #3A3631, dominiert die Fläche:
  „Lohnt sich Automatisierung in Ihrem Betrieb? 2 Minuten, eine Zahl, kein Bauchgefühl."
- Motiv (genau EIN Element, als SVG): eine halbrunde „Rechnet-sich-Anzeige" (Gauge).
  Heller Track (#E3DBCB), das rechte Drittel in Gold (#C8A96A) als „lohnt sich"-Zone,
  eine Nadel in #3A3631, die klar in die Gold-Zone zeigt, mittig eine Achse. Am linken
  Ende ein „?" (#7C766C), am rechten Ende ein „€" (#C8A96A): die Skala führt von der
  offenen Frage zur Euro-Antwort. Keine Bildunterschrift.
- Unten rechts ein Lockup: echte smartwandler-Bildmarke (logo-small.png, ca. 74 px) links neben der Wortmarke „smartwandler" (#3A3631), darunter in #7C766C:
  „Kostenloser Potenzial-Check · 2 Minuten"

Alle Texte exakt wörtlich, deutsche Umlaute korrekt, keine Gedankenstriche.

═══════════════════════════════════════════════════════════════════════════════
CREATIVE 5 · Verstehen müssen Sie es nicht (durchgestrichenes Kauderwelsch)
═══════════════════════════════════════════════════════════════════════════════

Erstelle eine eigenständige HTML-Datei (eine .html, alle Styles im <style>, optional
Google Font „Inter", sonst keine externen Abhängigkeiten), die ein statisches
Werbe-Creative für Meta Ads rendert.

Technik/Format:
- Die Creative-Fläche ist ein Container von exakt 1080 × 1350 px (Seitenverhältnis
  4:5, keine Abweichung). Erfüllt Mindestmaße 600 × 750 px.
- Alle Texte als echte, editierbare HTML-Textelemente (kein Text als Bild).
- Motive als CSS/SVG umsetzen, nicht als Rasterbild. Keine externen Bilder.
- Ich exportiere danach manuell als PNG/PDF; die Exportdatei bleibt unter 30 MB.

Markenstil smartwandler (warm, editorial, ruhig, hochwertig; KEIN Tech-Look, KEINE
Stockfotos, KEIN Neon, KEINE Roboter, KEINE Menschen):
- Hintergrund: warmer Verlauf statt flachem Weiß: linear-gradient(158deg, #FAF8F5, #F4EEE4, #ECE4D6), dazu ein dezenter radialer Gold-Glow rgba(200,169,106,0.16) hinter dem Motiv
- Haupttext #3A3631, sekundärer Text #5F5952, kleine Labels #7C766C
- Akzent: gedecktes Gold #C8A96A
- Schrift: Inter; Headline semibold, enge Laufweite, linksbündig, viel Weißraum

Layout (rein typografisch, kein Bildmotiv):
- Oben links ein KICKER: kurze goldene Linie, dahinter Uppercase-Text in #7C766C:
  „FÜR CHEFS, DIE KEINE IT-NERDS SIND"
- Darunter die HEADLINE groß in #3A3631, dominiert die Fläche:
  „Sie müssen Digitalisierung nicht verstehen. Nur wissen, was sie Ihnen bringt."
- Motiv (genau EIN Element, als CSS-Text): darunter drei durchgestrichene
  Fach-Buzzwords in #7C766C, jeweils mit feiner goldener Durchstreichlinie
  (#C8A96A): „API-Integration", „Cloud-Migration", „Workflow-Engine". Darunter eine
  Zeile OHNE Durchstreichung, in #3A3631 semibold: „Was bringt mir das in Euro?".
  Befreiend, mit Augenzwinkern; der Jargon wird entwertet, nicht der Chef.
- Unten rechts ein Lockup: echte smartwandler-Bildmarke (logo-small.png, ca. 74 px) links neben der Wortmarke „smartwandler" (#3A3631), darunter in #7C766C:
  „Kostenloser Potenzial-Check · 2 Minuten"

Alle Texte exakt wörtlich, deutsche Umlaute korrekt, keine Gedankenstriche.

═══════════════════════════════════════════════════════════════════════════════
NACH DEM GENERIEREN: SO EXPORTIERST DU (nicht mitkopieren)
═══════════════════════════════════════════════════════════════════════════════

- HTML im Browser öffnen, Texte bei Bedarf im Code oder direkt bearbeiten.
- Als PNG: Browser-Screenshot des 1080 × 1350-Containers (z. B. DevTools →
  Element als Screenshot aufnehmen, dann ist der Ausschnitt exakt).
- Als PDF: Drucken → „Als PDF speichern"; Seitengröße/Skalierung so wählen, dass
  das 4:5-Verhältnis erhalten bleibt.
- Prüfen: exakt 4:5, mindestens 600 × 750 px, Datei unter 30 MB.
- Für ein zusätzliches 1:1-Feld: denselben Container auf 1080 × 1080 px stellen und
  neu exportieren (Layout hält, da linksbündig und mit Weißraum aufgebaut).

═══════════════════════════════════════════════════════════════════════════════
QUALITÄTS-CHECK (nicht mitkopieren)
═══════════════════════════════════════════════════════════════════════════════

- [ ] Alle Texte korrekt (Umlaute, ß), keine Gedankenstriche
- [ ] Kicker klein oben, Headline dominiert, genau EIN Motiv-Element
- [ ] Farben stimmen (kein kaltes Blau/Grau, kein Neon, kein Tech-Klischee)
- [ ] Wortmarke „smartwandler" unten rechts vorhanden
- [ ] Container exakt 1080 × 1350 px (4:5), auf Handygröße noch lesbar (Daumen-Test)
- [ ] Export als PNG und/oder PDF, unter 30 MB

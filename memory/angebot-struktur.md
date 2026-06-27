---
name: angebot-struktur
description: Wie Philipp Kundenangebote aufbaut — schlankes Angebot + Detail-Anhang + Preisliste
metadata:
  type: feedback
---

Philipp versendet Kundenangebote als Set aus drei Dokumenten: ein **schlankes Angebot** (Positionen mit je einer knappen Beschreibungszeile + Preis), ein separater Anhang **„Leistungen im Detail"** (granulare Bullets, Timeline/Umfang je Modul, Ausschlüsse „nicht enthalten", Mitwirkungstabelle, Technologien) und die **Preisliste** als Referenz für die Paketcodes (A/B/C/D).

**Why:** Das Angebot soll „auf den Punkt" und übersichtlich sein; wer mehr will, liest den Anhang. Wenn das Angebot selbst schon volldetailliert ist, dupliziert der Anhang und verwirrt.

**How to apply:** Im Angebot die Positionstabellen auf reine Überschriften reduzieren — nur `<strong>Titel</strong>` + Preis, keine `descr`-Beschreibung. Unter jede Positionstabellen-Überschrift einen `<p class="lead">`-Verweis auf Anlage 1 „Leistungen im Detail" setzen. Die volle Tiefe (Bullets, Aufwand, Mitwirkung, Ausschlüsse) trägt allein `2_leistungen.html`. Bei Änderungen Zahlen/Dauern zwischen Angebot und Leistungen abgleichen (Mini-Differenzen fallen Kunden negativ auf). Verzeichnis: `angebot/` mit `1_angebot.html`, `2_leistungen.html`, `3_preisliste_ohne_foederung.html`, `4_agb.html`, `5_av_vertrag.html`. PDF-Export via Chrome ⌘P.

# Lokale Vorschau

```
python3 serve.py
```

Danach im Browser <http://localhost:8000> öffnen. Anderer Port: `python3 serve.py 8080`.
Beenden mit Strg+C.

**Auto-Reload:** Sobald eine HTML-, CSS- oder JS-Datei gespeichert wird, lädt der
Browser die Seite von selbst neu — Speichern genügt, kein manuelles F5. Das nötige
Skript wird nur beim Ausliefern in die Antwort eingefügt; die Dateien auf der Platte
bleiben unverändert und im Zip fürs FTP landet davon nichts.

**Nicht** `python3 -m http.server` benutzen. Der kennt die Rewrite-Regeln der `.htaccess`
nicht und liefert für die sauberen URLs 404 — die Branchen-Karten auf der Startseite
verlinken auf `/maschinenbau`, `/ingenieurbueros` und `/wissen-geht-in-rente`, nicht auf
die `.html`-Dateien. `serve.py` bildet dieselben Regeln nach, damit die lokale Vorschau
sich genauso verhält wie der Live-Server:

* `/maschinenbau` → liefert `maschinenbau.html` aus, URL bleibt sauber
* `/maschinenbau.html` → 301 auf `/maschinenbau`
* `/lokale-ki`, `/meeting-transkription`, `/voicemail` → 301 auf `/` (Seiten eingestellt)

Wenn eine neue Landingpage mit sauberer URL dazukommt, muss sie an **zwei** Stellen
eingetragen werden: in der `.htaccess` (für den Server) und im Dict `CLEAN_URLS`
in `serve.py` (für die Vorschau).

`serve.py` ist ein reines Entwicklungswerkzeug und wird von `create-zip.sh` nicht
mit aufs FTP genommen.


# Deployment

```
bash create-zip.sh
```

Erzeugt `smartwandler.zip` mit allem, was auf den Webroot gehört. Separat und manuell
aufs FTP müssen die beiden Config-Dateien mit den Keys:
`fb-capi-config.php` und `potenzialcheck/submit-config.php`.

Nach Änderungen an Seiten oder Sitemap: `sitemap.xml` in der Google Search Console
neu einreichen.


# Meta / Ads Setup

1. meta business account anlegen
2. instagram und facebook page connecten
3. ads account erstellen
4. unter settings bei business Infomrationen über business und email adresse hinterlegen sonst geht access token für CAPI nicht
5. pixel datensatz im events manger erstellen


# TODO

  1. Config-Datei vorbereiten (lokal, einmalig):
  cp fb-capi-config.php.example fb-capi-config.php

# access_token eintragen

* Events Manager --> Dataset --> Settings --> Conversions API --> Generate Access Token
* Setup without Dataset Quality --> damit hat nur der API token keine permissions dafür, aber im Events Manager sieht man es trotzdem

# test_event_code mit dem Code aus Events Manager → Test Events füllen (für Testlauf)

  1. Aufs FTP hochladen:
    - termin-gebucht.html (Standard-Deployment)
    - fb-capi.php (Standard-Deployment, ab jetzt in der Zip)
    - fb-capi-config.php (separat & manuell — nicht in der Zip, enthält den Token)
    - Vorgeschlagene Ablage: alles im Webroot neben index.html
  2. meetergo-Redirect: Im meetergo-Backend für den 30-Min-Meeting-Eventtyp die Redirect-URL setzen auf
  <https://www.smartwandler.de/termin-gebucht.html>
  3. Testen (vor scharfer Schaltung):
    - In Events Manager → "Test Events" den test_event_code kopieren, in die Config eintragen (ACHTUNG, wenn man den Brwoser wechselt, wechselt auch der Test Code - immer vorher nochmal oberhalb der events checken und ggf. nochmal neu in das php file hochladen.)
    - Buchung durchführen → in Test Events sollten zwei Events mit derselben event_id und Quelle "Server" + "Browser" auftauchen, dedupliziert (es kann einfach nur die dankeseite geladen werdenwo )
    - Wenn alles passt: test_event_code in der Config leeren oder zu '' setzen → live
    - Mit aktiviertem AdBlocker testen: dann sollte nur das Server-Event ankommen
  4. Match-Quality im Events Manager nach ein paar Tagen prüfen — falls sie für meeting_scheduled niedrig ausfällt, können wir später
  Email/Telefon (sha256-gehashed) aus dem meetergo-Redirect-URL-Parameter mit übergeben. Erstmal ist es so aber sauber.


AVV von MEta wird mit Nutzung des Dienstes geshclossen. Folgende Seiten kann man sich durchlesen:
https://www.facebook.com/legal/controller_addendum
https://www.facebook.com/legal/terms/dataprocessing
https://www.facebook.com/legal/technology_terms
unterschreiben


## Instagram Enrichtung
* damit der Ads Account richtig funtkioniert muss man bei INstagram auf Settings gehen --> dann Account Center --> Ad Preferences und dann kostenlose Werbung auswählen


Automatic website matching und Track events automatically without code in Event Manager --> Datensatz --> Settings muss AUS sein

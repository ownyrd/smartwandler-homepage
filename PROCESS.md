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





TODO
https://www.facebook.com/legal/controller_addendum
https://www.facebook.com/legal/terms/dataprocessing
https://www.facebook.com/legal/technology_terms
unterschreiben


todo:
* footer links von anderen subopages gägig machen


## Instagram Enrichtung
* damit der Ads Account richtig funtkioniert muss man bei INstagram auf Settings gehen --> dann Account Center --> Ad Preferences und dann kostenlose Werbung auswählen
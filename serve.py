#!/usr/bin/env python3
"""
Lokaler Vorschau-Server für die smartwandler-Website.

Hintergrund: Auf dem FTP-Space erledigt die .htaccess die sauberen URLs
(/maschinenbau statt /maschinenbau.html). Ein normaler `python3 -m http.server`
kennt diese Regeln nicht und liefert dort 404 — die internen Links der
Branchen-Karten funktionieren lokal also nicht.

Dieses Skript bildet die Rewrite-Regeln aus der .htaccess nach, damit die
lokale Vorschau sich genauso verhält wie der Live-Server. Am HTML muss dadurch
nichts geändert werden: Die Links zeigen weiterhin direkt auf die saubere URL,
ohne Redirect-Umweg.

Zusätzlich lädt der Browser die Seite automatisch neu, sobald sich eine
HTML-, CSS- oder JS-Datei ändert. Das nötige Skript wird nur beim Ausliefern
in die Antwort eingefügt — die Dateien auf der Platte bleiben unangetastet,
im Zip fürs FTP landet davon also nichts.

Aufruf:  python3 serve.py [port]        (Standard: 8000)
"""

import http.server
import os
import socketserver
import sys
from pathlib import Path

# Saubere URL -> tatsächliche Datei (Spiegel von .htaccess, Abschnitt "Clean URLs")
CLEAN_URLS = {
    "/blog": "/blog.html",
    "/blog/lokale-ki": "/blog-lokale-ki.html",
    "/ingenieurbueros": "/ingenieurbueros.html",
    "/maschinenbau": "/maschinenbau.html",
    "/wissen-geht-in-rente": "/wissen-geht-in-rente.html",
}

# Umkehrung: Datei -> saubere URL. Nicht aus dem Dateinamen ableitbar, weil
# /blog/lokale-ki auf blog-lokale-ki.html zeigt.
FILE_TO_CLEAN = {v: k for k, v in CLEAN_URLS.items()}

# Eingestellte Landingpages -> 301 auf die Startseite (Spiegel von .htaccess)
GONE = ("/lokale-ki", "/meeting-transkription", "/voicemail")

# Diese Dateien werden auf Änderungen beobachtet
WATCH_GLOBS = ("*.html", "*.css", "*.js", "potenzialcheck/*.html",
               "potenzialcheck/*.css", "potenzialcheck/*.js")

RELOAD_PATH = "/__reload"

RELOAD_SNIPPET = b"""
<!-- nur lokale Vorschau, wird von serve.py eingefuegt -->
<script>
(function () {
  var known = null;
  setInterval(function () {
    fetch('%s', { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (stamp) {
        if (known === null) { known = stamp; return; }
        if (stamp !== known) { location.reload(); }
      })
      .catch(function () { /* Server weg, einfach weiterprobieren */ });
  }, 600);
})();
</script>
""" % RELOAD_PATH.encode()


def current_stamp(root: Path) -> str:
    """Ein Wert, der sich ändert, sobald eine beobachtete Datei gespeichert wird."""
    newest = 0.0
    count = 0
    for pattern in WATCH_GLOBS:
        for f in root.glob(pattern):
            try:
                newest = max(newest, f.stat().st_mtime)
                count += 1
            except OSError:
                pass
    # count mit hinein, damit auch das Anlegen/Löschen einer Datei auffällt
    return f"{newest:.3f}-{count}"


class Handler(http.server.SimpleHTTPRequestHandler):
    root = Path(".")

    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0].rstrip("/") or "/"

        if path == RELOAD_PATH:
            return self._send_stamp()

        # Entfernte Seiten: 301 auf die Startseite, mit und ohne .html
        if path.removesuffix(".html") in GONE:
            return self._redirect("/")

        # .html-Variante einer sauberen URL: 301 auf die saubere Form
        if path in FILE_TO_CLEAN:
            return self._redirect(FILE_TO_CLEAN[path])

        # Saubere URL: intern die .html-Datei ausliefern, URL bleibt unverändert
        if path in CLEAN_URLS:
            self.path = CLEAN_URLS[path]

        html = self._resolve_html()
        if html is not None:
            return self._send_html(html)

        return super().do_GET()

    # ── Hilfen ────────────────────────────────────────────────────────────

    def _redirect(self, location):
        self.send_response(301)
        self.send_header("Location", location)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _send_stamp(self):
        body = current_stamp(self.root).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _resolve_html(self):
        """Liefert den Dateipfad, wenn die Anfrage auf eine HTML-Seite zeigt."""
        fs = Path(self.translate_path(self.path))
        if fs.is_dir():
            fs = fs / "index.html"
        return fs if fs.suffix == ".html" and fs.is_file() else None

    def _send_html(self, fs: Path):
        body = fs.read_bytes()
        marker = b"</body>"
        cut = body.rfind(marker)
        body = body[:cut] + RELOAD_SNIPPET + body[cut:] if cut != -1 else body + RELOAD_SNIPPET
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # Beim Entwickeln nervt Caching mehr als es nützt
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        if RELOAD_PATH in (args[0] if args else ""):
            return  # das Polling nicht mitloggen, sonst rauscht die Konsole voll
        sys.stderr.write("  %s\n" % (fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    Handler.root = Path(".")
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", port), Handler) as httpd:
        httpd.daemon_threads = True
        print(f"Vorschau laeuft auf http://localhost:{port}/")
        print("Saubere URLs aktiv: " + ", ".join(sorted(CLEAN_URLS)))
        print("Auto-Reload aktiv: HTML, CSS und JS werden beobachtet")
        print("Beenden mit Strg+C")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nBeendet.")

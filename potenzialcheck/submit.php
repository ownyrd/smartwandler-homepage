<?php
declare(strict_types=1);

// ════════════════════════════════════════════════════════════════════
// Potenzial-Check — submit.php   (Backlog 2.5)
//
// Empfängt POST {antworten, name, email, consent, ergebnis_min/max} vom
// Browser (check.js) und:
//   (a) INSERT in MySQL                              (C5, eigene Wahrheit)
//   (b) Brevo Transactional-API → Report-Mail        (IMMER, angeforderter Dienst)
//   (c) NUR bei consent=true → Brevo DOI (Contacts + Bestätigungsmail)  (C2)
//
// Antwort: 200 {"ok":true} wenn die Report-Mail rausging.
// Der Brevo-API-Key liegt NUR in submit-config.php (C1).
// ════════════════════════════════════════════════════════════════════

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Content-Type: application/json; charset=utf-8');

// ── Config laden (nicht im Repo) ──
$configFile = __DIR__ . '/submit-config.php';
if (!is_file($configFile)) {
    respond(500, ['ok' => false, 'error' => 'config_missing']);
}
/** @var array $config */
$config = require $configFile;
if (!is_array($config) || empty($config['brevo_api_key']) || empty($config['sender_email'])) {
    respond(500, ['ok' => false, 'error' => 'config_invalid']);
}

// ── Methode prüfen ──
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method']);
}

// ── Origin / Referer prüfen (Abuse-Schutz, wie s-event.php) ──
$allowedHosts = isset($config['allowed_hosts']) && is_array($config['allowed_hosts'])
    ? $config['allowed_hosts']
    : ['www.smartwandler.de', 'smartwandler.de'];
$sourceHost = '';
foreach ([$_SERVER['HTTP_ORIGIN'] ?? '', $_SERVER['HTTP_REFERER'] ?? ''] as $candidate) {
    if ($candidate === '') continue;
    $parsed = parse_url($candidate);
    if (!empty($parsed['host'])) { $sourceHost = $parsed['host']; break; }
}
if (!in_array($sourceHost, $allowedHosts, true)) {
    respond(403, ['ok' => false, 'error' => 'origin']);
}

// ── Body lesen ──
$raw = file_get_contents('php://input');
if ($raw === false || $raw === '' || strlen($raw) > 8192) {
    respond(400, ['ok' => false, 'error' => 'body']);
}
$body = json_decode($raw, true);
if (!is_array($body)) {
    respond(400, ['ok' => false, 'error' => 'json']);
}

// ════════════════════════════════════════════════════════════════════
// Eingaben validieren / normalisieren
// ════════════════════════════════════════════════════════════════════
$antworten = isset($body['antworten']) && is_array($body['antworten']) ? $body['antworten'] : [];

$WHITELIST = [
    'branche'       => ['handwerk_bau','handel_ecommerce','dienstleistung','produktion','gesundheit_pflege','kanzlei','sonstige'],
    'mitarbeiter'   => ['1_4','5_20','21_50','ueber_50'],
    'rolle'         => ['inhaber_gf','geschaeftsleitung','it_projekt','mitarbeiter'],
    'stunden'       => ['unter_5','5_10','10_20','ueber_20','weiss_nicht','manuell'],
    'zufriedenheit' => ['software_teuer','cloud_unwohl','manuell','unsicher'],
    'dringlichkeit' => ['asap','monate','informieren'],
];
$ZEITFRESSER = ['angebote_rechnungen','daten_doppelt','emails','dokumente','koordination','berichte'];

$branche       = pickOne($antworten, 'branche', $WHITELIST['branche']);
$mitarbeiter   = pickOne($antworten, 'mitarbeiter', $WHITELIST['mitarbeiter']);
$rolle         = pickOne($antworten, 'rolle', $WHITELIST['rolle']);
$stunden       = pickOne($antworten, 'stunden', $WHITELIST['stunden']);
$zufriedenheit = pickOne($antworten, 'zufriedenheit', $WHITELIST['zufriedenheit']);
$dringlichkeit = pickOne($antworten, 'dringlichkeit', $WHITELIST['dringlichkeit']);

$zeitfresserArr = [];
if (isset($antworten['zeitfresser']) && is_array($antworten['zeitfresser'])) {
    foreach ($antworten['zeitfresser'] as $z) {
        if (is_string($z) && in_array($z, $ZEITFRESSER, true)) $zeitfresserArr[] = $z;
    }
}
$zeitfresserCsv = implode(',', $zeitfresserArr);

$brancheCustom = '';
if ($branche === 'sonstige' && isset($antworten['branche_custom']) && is_string($antworten['branche_custom'])) {
    $brancheCustom = mb_substr(trim($antworten['branche_custom']), 0, 120);
}
$stundenCustom = null;
if ($stunden === 'manuell' && isset($antworten['stunden_custom'])) {
    $sc = (int) $antworten['stunden_custom'];
    if ($sc >= 0 && $sc <= 60) $stundenCustom = $sc;
}

$name  = isset($body['name'])  && is_string($body['name'])  ? mb_substr(trim($body['name']), 0, 120)  : '';
$email = isset($body['email']) && is_string($body['email']) ? mb_substr(trim($body['email']), 0, 255) : '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'email']);
}
$consent = !empty($body['consent']);

$ergebnisMin = isset($body['ergebnis_min']) ? max(0, (int) $body['ergebnis_min']) : 0;
$ergebnisMax = isset($body['ergebnis_max']) ? max(0, (int) $body['ergebnis_max']) : 0;

// ════════════════════════════════════════════════════════════════════
// (a) INSERT in MySQL  — Fehler wird geloggt, blockiert aber die Mail nicht
// ════════════════════════════════════════════════════════════════════
try {
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['db_host'] ?? 'localhost', $config['db_name'] ?? '');
    $pdo = new PDO($dsn, $config['db_user'] ?? '', $config['db_pass'] ?? '', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', (string) ($config['db_table'] ?? 'leads'));
    $sql = "INSERT INTO `$table`
        (branche, branche_custom, mitarbeiter, rolle, zeitfresser, stunden, stunden_custom,
         zufriedenheit, dringlichkeit, ergebnis_min, ergebnis_max, email, name, consent)
        VALUES
        (:branche, :branche_custom, :mitarbeiter, :rolle, :zeitfresser, :stunden, :stunden_custom,
         :zufriedenheit, :dringlichkeit, :ergebnis_min, :ergebnis_max, :email, :name, :consent)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':branche'        => $branche,
        ':branche_custom' => $brancheCustom !== '' ? $brancheCustom : null,
        ':mitarbeiter'    => $mitarbeiter,
        ':rolle'          => $rolle,
        ':zeitfresser'    => $zeitfresserCsv,
        ':stunden'        => $stunden,
        ':stunden_custom' => $stundenCustom,
        ':zufriedenheit'  => $zufriedenheit,
        ':dringlichkeit'  => $dringlichkeit,
        ':ergebnis_min'   => $ergebnisMin,
        ':ergebnis_max'   => $ergebnisMax,
        ':email'          => $email,
        ':name'           => $name,
        ':consent'        => $consent ? 1 : 0,
    ]);
} catch (Throwable $e) {
    logLine($config, 'db_error: ' . $e->getMessage());
    // absichtlich weiter: der angeforderte Report soll trotzdem rausgehen.
}

// ── Labels (Alltagssprache) für Report + Attribute ──
$LABELS = labelMap();
$routing = computeRouting($branche, $zufriedenheit);

// ════════════════════════════════════════════════════════════════════
// (b) Report-Mail via Brevo Transactional (IMMER)
// ════════════════════════════════════════════════════════════════════
$templateId = (int) ($config['brevo_report_template_id'] ?? 0);
$mail = [
    'sender'  => ['name' => (string) $config['sender_name'], 'email' => (string) $config['sender_email']],
    'to'      => [['email' => $email, 'name' => $name !== '' ? $name : $email]],
    'replyTo' => ['email' => (string) ($config['reply_to'] ?? $config['sender_email'])],
];
if ($templateId > 0) {
    // Variante: Layout + Texte im Brevo-Template (mit {% if %}-Bedingungen),
    // submit.php liefert nur die Werte/Schalter als params.
    $mail['templateId'] = $templateId;
    $mail['params'] = [
        // Basis
        'NAME'        => $name !== '' ? $name : 'zusammen',
        'MIN'         => number_format($ergebnisMin, 0, ',', '.'),
        'MAX'         => number_format($ergebnisMax, 0, ',', '.'),
        'HEADLINE'    => $routing['headline'],
        'BODY'        => $routing['body'],
        'MEETERGO'    => 'https://cal.meetergo.com/philipp-anders/30-min-meeting',
        // Datensicherheits-Block nur bei sensibler Branche / Cloud-Bedenken (gleiches Routing wie HEADLINE/BODY)
        'SHOW_DSGVO'  => $routing['mode'] === 'dsgvo',
        // Demo-Video (ein Beweis-Element). Über submit-config.php überschreibbar; leer = Video-Block aus.
        'VIDEO_URL'    => (string) ($config['video_url']    ?? 'https://www.smartwandler.de/video/smartwandler-demo-720p.mp4'),
        'VIDEO_POSTER' => (string) ($config['video_poster'] ?? 'https://www.smartwandler.de/video/smartwandler-demo-poster.jpg'),
        // Für {% if params.BRANCHE_KEY == "…" %}
        'BRANCHE_KEY' => $branche,
        'BRANCHE'     => $branche === 'sonstige' && $brancheCustom !== '' ? $brancheCustom : ($LABELS['branche'][$branche] ?? ''),
        'MITARBEITER' => $LABELS['mitarbeiter'][$mitarbeiter] ?? '',
        'ROLLE'       => $LABELS['rolle'][$rolle] ?? '',
        'STUNDEN'     => $stunden === 'manuell' && $stundenCustom !== null ? ($stundenCustom . ' h/Kopf') : ($LABELS['stunden'][$stunden] ?? ''),
        'ZUFRIEDENHEIT' => $LABELS['zufriedenheit'][$zufriedenheit] ?? '',
        'DRINGLICHKEIT' => $LABELS['dringlichkeit'][$dringlichkeit] ?? '',
        'ZEITFRESSER' => arr_to_labels($zeitfresserArr, $LABELS['zeitfresser']),
        // Pro Routineaufgabe ein Schalter für {% if params.ZF_… %}
        'ZF_ANGEBOTE'     => in_array('angebote_rechnungen', $zeitfresserArr, true),
        'ZF_DATEN'        => in_array('daten_doppelt', $zeitfresserArr, true),
        'ZF_EMAILS'       => in_array('emails', $zeitfresserArr, true),
        'ZF_DOKUMENTE'    => in_array('dokumente', $zeitfresserArr, true),
        'ZF_KOORDINATION' => in_array('koordination', $zeitfresserArr, true),
        'ZF_BERICHTE'     => in_array('berichte', $zeitfresserArr, true),
    ];
} else {
    // Variante: HTML wird hier gebaut (funktioniert ohne Template-Pflege).
    $mail['subject']     = sprintf('Ihr Potenzial-Check: %s bis %s € pro Jahr',
        number_format($ergebnisMin, 0, ',', '.'), number_format($ergebnisMax, 0, ',', '.'));
    $mail['htmlContent'] = buildReportHtml([
        'name' => $name, 'min' => $ergebnisMin, 'max' => $ergebnisMax,
        'zeitfresser' => $zeitfresserArr, 'routing' => $routing, 'labels' => $LABELS,
    ]);
}

[$mailStatus, $mailResp] = brevoPost($config, 'https://api.brevo.com/v3/smtp/email', $mail);
logLine($config, sprintf('report to=%s status=%d resp=%s', $email, $mailStatus, substr($mailResp, 0, 300)));

if ($mailStatus < 200 || $mailStatus >= 300) {
    respond(502, ['ok' => false, 'error' => 'mail']);
}

// ════════════════════════════════════════════════════════════════════
// (c) Consent → Brevo Double-Opt-In (Kontakt + Bestätigungsmail)
// ════════════════════════════════════════════════════════════════════
$listId    = (int) ($config['brevo_list_id'] ?? 0);
$doiTplId  = (int) ($config['brevo_doi_template_id'] ?? 0);
$redirect  = (string) ($config['doi_redirect_url'] ?? '');

if ($consent && $listId > 0 && $doiTplId > 0 && $redirect !== '') {
    $doi = [
        'email'          => $email,
        'includeListIds' => [$listId],
        'templateId'     => $doiTplId,
        'redirectionUrl' => $redirect,
    ];
    if (!empty($config['contact_attributes_enabled'])) {
        $doi['attributes'] = [
            'VORNAME'                  => $name,
            'BRANCHE'                  => $branche === 'sonstige' && $brancheCustom !== '' ? $brancheCustom : ($LABELS['branche'][$branche] ?? ''),
            'ROLLE'                    => $LABELS['rolle'][$rolle] ?? '',
            'SW_MITARBEITER'           => $LABELS['mitarbeiter'][$mitarbeiter] ?? '',
            'SW_ROUTINESTUNDEN_PRO_MA' => $stunden === 'manuell' && $stundenCustom !== null ? ($stundenCustom . ' h/Kopf') : ($LABELS['stunden'][$stunden] ?? ''),
            'SW_ZUFRIEDENHEIT'         => $LABELS['zufriedenheit'][$zufriedenheit] ?? '',
            'SW_DRINGLICHKEIT'         => $LABELS['dringlichkeit'][$dringlichkeit] ?? '',
            'SW_POTENZIAL_MIN'         => $ergebnisMin,
            'SW_POTENZIAL_MAX'         => $ergebnisMax,
        ];
    }
    [$doiStatus, $doiResp] = brevoPost($config, 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation', $doi);
    logLine($config, sprintf('doi to=%s status=%d resp=%s', $email, $doiStatus, substr($doiResp, 0, 300)));
    // Fehler hier blockiert die Erfolgsmeldung NICHT — der Report ging bereits raus.
} elseif ($consent) {
    logLine($config, 'doi skipped (list/template/redirect not configured)');
}

respond(200, ['ok' => true]);


// ════════════════════════════════════════════════════════════════════
// Helper
// ════════════════════════════════════════════════════════════════════
function respond(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function pickOne(array $src, string $key, array $whitelist): string {
    $v = isset($src[$key]) && is_string($src[$key]) ? $src[$key] : '';
    return in_array($v, $whitelist, true) ? $v : '';
}

/** @return array{0:int,1:string} [httpStatus, responseBody] */
function brevoPost(array $config, string $url, array $payload): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'content-type: application/json',
            'api-key: ' . $config['brevo_api_key'],
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
    ]);
    $resp = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($resp === false) $resp = 'curl_error: ' . $err;
    return [$status, is_string($resp) ? $resp : ''];
}

function logLine(array $config, string $msg): void {
    if (empty($config['log_file']) || !is_string($config['log_file'])) return;
    @file_put_contents($config['log_file'], sprintf("[%s] %s\n", date('c'), $msg), FILE_APPEND | LOCK_EX);
}

function arr_to_labels(array $values, array $map): string {
    $out = [];
    foreach ($values as $v) $out[] = $map[$v] ?? $v;
    return implode(', ', $out);
}

/** Routing spiegelt computeRouting() aus check.js (1.3). */
function computeRouting(string $branche, string $zufriedenheit): array {
    $sensibel = ($branche === 'gesundheit_pflege' || $branche === 'kanzlei');
    if ($zufriedenheit === 'cloud_unwohl' || $sensibel) {
        return [
            'mode' => 'dsgvo',
            'headline' => 'Ihre Daten müssen dafür nicht in eine fremde Cloud.',
            'body' => 'Wir richten Automatisierung wahlweise als DSGVO-konforme EU-Cloud oder direkt bei Ihnen vor Ort (On-Premise) ein. Was in Ihrem Fall besser passt, klären wir gemeinsam im Gespräch.',
        ];
    }
    if ($zufriedenheit === 'software_teuer') {
        return [
            'mode' => 'festpreis',
            'headline' => 'Ohne teure Abos, die nicht richtig zu Ihnen passen.',
            'body' => 'Statt laufender Lizenzkosten setzen wir auf eine maßgeschneiderte Lösung zum Festpreis (Wartungspakete optional). Sie zahlen einmal für etwas, das genau zu Ihren Abläufen passt.',
        ];
    }
    return [
        'mode' => 'standard',
        'headline' => 'So holen Sie dieses Potenzial Schritt für Schritt zurück.',
        'body' => 'Im kostenlosen Erstgespräch schauen wir uns Ihre größten Zeitfresser an und zeigen, welche sich am schnellsten automatisieren lassen. Für Sie lokal, sicher und maßgeschneidert.',
    ];
}

function labelMap(): array {
    return [
        'branche' => [
            'handwerk_bau' => 'Handwerk / Bau', 'handel_ecommerce' => 'Handel / E-Commerce',
            'dienstleistung' => 'Dienstleistung / Beratung', 'produktion' => 'Produktion / Fertigung',
            'gesundheit_pflege' => 'Gesundheit / Pflege', 'kanzlei' => 'Kanzlei', 'sonstige' => 'Sonstige',
        ],
        'mitarbeiter' => ['1_4' => '1 bis 4', '5_20' => '5 bis 20', '21_50' => '21 bis 50', 'ueber_50' => 'über 50'],
        'rolle' => [
            'inhaber_gf' => 'Inhaber:in / Geschäftsführung', 'geschaeftsleitung' => 'Geschäftsleitung / Prokura',
            'it_projekt' => 'IT- / Projektverantwortlich', 'mitarbeiter' => 'Mitarbeiter:in',
        ],
        'zeitfresser' => [
            'angebote_rechnungen' => 'Angebote / Rechnungen schreiben', 'daten_doppelt' => 'Daten doppelt eintippen',
            'emails' => 'E-Mails sortieren & beantworten', 'dokumente' => 'Dokumente suchen & ablegen',
            'koordination' => 'Termine / Aufträge / Einsätze koordinieren', 'berichte' => 'Berichte / Protokolle / Doku erstellen',
        ],
        'stunden' => ['unter_5' => 'Unter 5 Stunden', '5_10' => '5 bis 10 Stunden', '10_20' => '10 bis 20 Stunden', 'ueber_20' => 'Über 20 Stunden', 'weiss_nicht' => 'Weiß nicht genau', 'manuell' => 'Eigene Angabe'],
        'zufriedenheit' => ['software_teuer' => 'Software zu teuer / passt nicht', 'cloud_unwohl' => 'Kein gutes Gefühl bei Cloud-Daten', 'manuell' => 'Vieles läuft manuell', 'unsicher' => 'Unsicher, was geht'],
        'dringlichkeit' => ['asap' => 'So schnell wie möglich', 'monate' => 'In den nächsten Monaten', 'informieren' => 'Erstmal informieren'],
    ];
}

/** Baut die Report-Mail als E-Mail-sicheres HTML (Tabellen, inline styles). */
function buildReportHtml(array $d): string {
    $name = htmlspecialchars($d['name'] !== '' ? $d['name'] : 'zusammen', ENT_QUOTES, 'UTF-8');
    $min  = number_format((int) $d['min'], 0, ',', '.');
    $max  = number_format((int) $d['max'], 0, ',', '.');
    $headline = htmlspecialchars($d['routing']['headline'], ENT_QUOTES, 'UTF-8');
    $body     = htmlspecialchars($d['routing']['body'], ENT_QUOTES, 'UTF-8');
    $meetergo = 'https://cal.meetergo.com/philipp-anders/30-min-meeting';

    $items = '';
    foreach ($d['zeitfresser'] as $z) {
        $lbl = htmlspecialchars($d['labels']['zeitfresser'][$z] ?? $z, ENT_QUOTES, 'UTF-8');
        $items .= '<tr><td style="padding:6px 0;color:#3A3631;font-size:15px;line-height:1.5">'
                . '<span style="color:#C8A96A">&#10003;</span>&nbsp;&nbsp;' . $lbl . '</td></tr>';
    }
    if ($items === '') {
        $items = '<tr><td style="padding:6px 0;color:#5F5952;font-size:15px">Ihre wiederkehrenden Aufgaben schauen wir uns im Gespräch gemeinsam an.</td></tr>';
    }

    return '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">'
      . '<meta name="viewport" content="width=device-width,initial-scale=1"></head>'
      . '<body style="margin:0;padding:0;background:#EDEBE6;">'
      . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDEBE6;padding:24px 12px">'
      . '<tr><td align="center">'
      . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FAF8F5;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">'
      // Header
      . '<tr><td style="padding:28px 32px 8px;">'
      . '<div style="font-size:20px;font-weight:bold;color:#3A3631;letter-spacing:-0.02em">smartwandler</div>'
      . '<div style="font-size:12px;color:#7C766C;letter-spacing:0.06em;text-transform:uppercase;margin-top:2px">Ihr Potenzial-Check</div>'
      . '</td></tr>'
      // Range
      . '<tr><td style="padding:16px 32px 0;">'
      . '<p style="margin:0 0 6px;font-size:15px;color:#5F5952">Hallo ' . $name . ',</p>'
      . '<p style="margin:0 0 14px;font-size:15px;color:#5F5952;line-height:1.6">basierend auf Ihren Angaben ist bei Ihnen aktuell grob folgendes Potenzial in Routinearbeit gebunden:</p>'
      . '<div style="font-size:34px;font-weight:bold;color:#3A3631;letter-spacing:-0.03em">' . $min . ' bis ' . $max . ' &euro;</div>'
      . '<div style="font-size:13px;color:#7C766C;margin-top:4px">pro Jahr, das sich durch Automatisierung Schritt für Schritt freimachen lässt.</div>'
      . '</td></tr>'
      // Routing
      . '<tr><td style="padding:22px 32px 0;">'
      . '<div style="font-size:18px;font-weight:bold;color:#3A3631;margin-bottom:6px">' . $headline . '</div>'
      . '<div style="font-size:15px;color:#5F5952;line-height:1.6">' . $body . '</div>'
      . '</td></tr>'
      // Zeitfresser
      . '<tr><td style="padding:22px 32px 0;">'
      . '<div style="font-size:13px;color:#7C766C;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px">Ihre größten Zeitfresser</div>'
      . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $items . '</table>'
      . '</td></tr>'
      // CTA
      . '<tr><td style="padding:26px 32px 8px;">'
      . '<a href="' . $meetergo . '" style="display:inline-block;background:#C8A96A;color:#3A3631;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:100px">Kostenloses Erstgespräch buchen &rarr;</a>'
      . '</td></tr>'
      . '<tr><td style="padding:8px 32px 28px;">'
      . '<p style="margin:0;font-size:12px;color:#7C766C;line-height:1.5">Grobe Orientierung auf Basis Ihrer Angaben, keine verbindliche Zusage. Die genaue Einschätzung machen wir gemeinsam im Gespräch.</p>'
      . '</td></tr>'
      // Footer
      . '<tr><td style="padding:20px 32px;background:#3A3631">'
      . '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7)">smartwandler &middot; ein Projekt von decentnodes.de</p>'
      . '<p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.5)">'
      . '<a href="https://www.smartwandler.de/impressum.html" style="color:rgba(255,255,255,0.6)">Impressum</a> &middot; '
      . '<a href="https://www.smartwandler.de/datenschutz.html" style="color:rgba(255,255,255,0.6)">Datenschutz</a></p>'
      . '</td></tr>'
      . '</table></td></tr></table></body></html>';
}

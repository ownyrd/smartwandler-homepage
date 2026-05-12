<?php
declare(strict_types=1);

// ════════════════════════════════════════════════════════════════════
// Meta Conversions API Endpoint
// Empfängt POST mit JSON-Body vom Browser (termin-gebucht.html) und
// leitet das Event serverseitig an Meta weiter. Zusammen mit dem
// Browser-Pixel-Event (gleiche event_id, gleicher event_name) ermöglicht
// das Deduplication auf Meta-Seite und Tracking trotz AdBlocker.
// ════════════════════════════════════════════════════════════════════

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// ── Config laden (Token + Pixel-ID, NICHT im Repo) ──
$configFile = __DIR__ . '/fb-capi-config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    exit;
}
/** @var array $config */
$config = require $configFile;
if (!is_array($config) || empty($config['pixel_id']) || empty($config['access_token'])) {
    http_response_code(500);
    exit;
}

// ── Methode prüfen ──
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    exit;
}

// ── Origin / Referer prüfen (einfacher Abuse-Schutz) ──
$allowedHosts = ['www.smartwandler.de', 'smartwandler.de'];
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$sourceHost = '';
foreach ([$origin, $referer] as $candidate) {
    if ($candidate === '') continue;
    $parsed = parse_url($candidate);
    if (!empty($parsed['host'])) {
        $sourceHost = $parsed['host'];
        break;
    }
}
if (!in_array($sourceHost, $allowedHosts, true)) {
    http_response_code(403);
    exit;
}

// ── Body lesen ──
$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    http_response_code(400);
    exit;
}
if (strlen($raw) > 4096) {
    http_response_code(413);
    exit;
}
$body = json_decode($raw, true);
if (!is_array($body)) {
    http_response_code(400);
    exit;
}

// ── Pflichtfelder ──
$eventId   = isset($body['event_id'])   && is_string($body['event_id'])   ? trim($body['event_id'])   : '';
$eventName = isset($body['event_name']) && is_string($body['event_name']) ? trim($body['event_name']) : '';
if ($eventId === '' || $eventName === '') {
    http_response_code(400);
    exit;
}

// ── Whitelist für Event-Namen (Schutz vor Missbrauch der Endpoint-URL) ──
$allowedEvents = ['meeting_scheduled'];
if (!in_array($eventName, $allowedEvents, true)) {
    http_response_code(400);
    exit;
}

// ── User-Data zusammensetzen ──
// Wichtig: client_ip_address und client_user_agent werden UNGEHASHT übergeben;
// Meta hashed/normalisiert serverseitig selbst.
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

$userData = [];
if ($ip !== '' && filter_var($ip, FILTER_VALIDATE_IP) !== false) {
    $userData['client_ip_address'] = $ip;
}
if ($ua !== '') {
    $userData['client_user_agent'] = substr($ua, 0, 500);
}
if (!empty($body['fbp']) && is_string($body['fbp'])) {
    $userData['fbp'] = substr($body['fbp'], 0, 200);
}
if (!empty($body['fbc']) && is_string($body['fbc'])) {
    $userData['fbc'] = substr($body['fbc'], 0, 200);
}

// ── Event-Source-URL: bevorzugt vom Client gemeldet, sonst Referer ──
$eventSourceUrl = '';
if (!empty($body['event_source_url']) && is_string($body['event_source_url'])) {
    $candidate = filter_var($body['event_source_url'], FILTER_VALIDATE_URL);
    if ($candidate !== false) {
        $eventSourceUrl = $candidate;
    }
}
if ($eventSourceUrl === '' && $referer !== '') {
    $candidate = filter_var($referer, FILTER_VALIDATE_URL);
    if ($candidate !== false) {
        $eventSourceUrl = $candidate;
    }
}

$event = [
    'event_name'    => $eventName,
    'event_time'    => time(),
    'event_id'      => substr($eventId, 0, 100),
    'action_source' => 'website',
    'user_data'     => $userData,
];
if ($eventSourceUrl !== '') {
    $event['event_source_url'] = $eventSourceUrl;
}

$payload = [
    'data'         => [$event],
    'access_token' => $config['access_token'],
];

// Optional: Test-Modus (Events Manager → Test Events). Code aus Config.
if (!empty($config['test_event_code']) && is_string($config['test_event_code'])) {
    $payload['test_event_code'] = $config['test_event_code'];
}

// ── An Meta Conversions API senden ──
$pixelId    = (string) $config['pixel_id'];
$apiVersion = isset($config['api_version']) && is_string($config['api_version']) ? $config['api_version'] : 'v21.0';
$endpoint   = "https://graph.facebook.com/{$apiVersion}/{$pixelId}/events";

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 5,
    CURLOPT_CONNECTTIMEOUT => 3,
]);
$response = curl_exec($ch);
$status   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

// ── Optionales Logging (Pfad in Config setzen, sonst aus) ──
if (!empty($config['log_file']) && is_string($config['log_file'])) {
    $logLine = sprintf(
        "[%s] event=%s id=%s ip=%s status=%d curl_err=%s response=%s\n",
        date('c'),
        $eventName,
        $eventId,
        $ip,
        $status,
        $curlErr !== '' ? $curlErr : '-',
        is_string($response) ? substr($response, 0, 500) : '-'
    );
    @file_put_contents($config['log_file'], $logLine, FILE_APPEND | LOCK_EX);
}

if ($status >= 200 && $status < 300) {
    http_response_code(204);
    exit;
}

http_response_code(502);
exit;
